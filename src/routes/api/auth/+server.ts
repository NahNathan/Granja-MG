import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '$env/dynamic/private';
import { eq } from 'drizzle-orm';

const JWT_SECRET = env.JWT_SECRET || 'default_secret_key';  // Adicione uma chave secreta no seu .env

// POST: Login do usuário
export async function POST({ request, cookies }) {
  try {
    const { username, password } = await request.json();

    // Verificar se os dados foram fornecidos
    if (!username || !password) {
      throw error(400, 'Username e senha são obrigatórios.');
    }

    // Buscar o usuário no banco de dados
    const [existingUser] = await db.select().from(user).where(eq(user.username, username));

    if (!existingUser) {
      throw error(401, 'Usuário não encontrado.');
    }

    // Verificar se a senha está correta
    const passwordMatch = await bcrypt.compare(password, existingUser.passwordHash);
    if (!passwordMatch) {
      throw error(401, 'Senha incorreta.');
    }

    // Gerar o token JWT
    const token = jwt.sign(
      { id: existingUser.id, username: existingUser.username, role: existingUser.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Armazenar o token em um cookie HTTP-only
    cookies.set('auth_token', token, {
      httpOnly: true,
      path: '/',
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production', // Apenas seguro em produção
      maxAge: 60 * 60 * 24  // 1 dia
    });

    return json({ message: 'Login bem-sucedido!' });
  } catch (err) {
    console.error(err);
    throw error(500, 'Erro ao realizar o login.');
  }
}
