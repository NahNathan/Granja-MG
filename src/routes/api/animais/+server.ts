import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// GET: Recuperar todos os animais
export async function GET() {
  try {
    const animais = await db.select().from(animal);
    return json(animais);
  } catch (err) {
    throw error(500, 'Erro ao buscar animais.');
  }
}

// POST: Adicionar um novo animal
export async function POST({ request }) {
  try {
    const data = await request.json();

    if (!data.id || !data.nome || !data.tipo) {
      throw error(400, 'Dados incompletos para adicionar um animal.');
    }

    await db.insert(animal).values({
      id: data.id, // Agora `VARCHAR(255)`
      nome: data.nome,
      tipo: data.tipo,
      quantidade: data.quantidade,
      galpao: data.galpao,
      ativo: data.ativo
    });

    return json({ message: 'Animal adicionado com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao adicionar animal.');
  }
}

// PUT: Atualizar um animal existente
export async function PUT({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID do animal é obrigatório para atualização.');
    }

    await db.update(animal)
      .set({
        nome: data.nome,
        tipo: data.tipo,
        quantidade: data.quantidade,
        galpao: data.galpao,
        ativo: data.ativo
      })
      .where(eq(animal.id, data.id));

    return json({ message: 'Animal atualizado com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao atualizar animal.');
  }
}

// DELETE: Remover um animal
export async function DELETE({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID do animal é obrigatório para exclusão.');
    }

    await db.delete(animal).where(eq(animal.id, data.id));

    return json({ message: 'Animal removido com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao remover animal.');
  }
}
