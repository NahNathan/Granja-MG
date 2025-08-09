import { db } from '$lib/server/db';
import { animal } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const animais = await db.select().from(animal);
    return json(animais);
  } catch (err) {
    throw error(500, 'Erro ao buscar animais.');
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    if (!data.nome || !data.tipo || !data.quantidade || !data.galpao) {
      throw error(400, 'nome, tipo, quantidade e galpao são obrigatórios.');
    }

    await db.insert(animal).values({
      id: crypto.randomUUID(),
      nome: data.nome,
      tipo: data.tipo,
      quantidade: Number(data.quantidade),
      galpao: data.galpao,
      ativo: data.ativo ?? true
    });

    return json({ message: 'Animal adicionado com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao adicionar animal.');
  }
}

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
        quantidade: data.quantidade != null ? Number(data.quantidade) : undefined,
        galpao: data.galpao,
        ativo: typeof data.ativo === 'boolean' ? data.ativo : undefined
      })
      .where(eq(animal.id, data.id));

    return json({ message: 'Animal atualizado com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao atualizar animal.');
  }
}

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
