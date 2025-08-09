import { db } from '$lib/server/db';
import { financeiro } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const transacoes = await db.select().from(financeiro);
    return json(transacoes);
  } catch (err) {
    throw error(500, 'Erro ao buscar transações financeiras.');
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    if (!data.tipo || !data.descricao || data.valor == null || !data.criadoPor) {
      throw error(400, 'tipo, descricao, valor e criadoPor são obrigatórios.');
    }

    await db.insert(financeiro).values({
      id: crypto.randomUUID(),
      tipo: String(data.tipo),
      descricao: String(data.descricao),
      valor: String(data.valor),
      data: data.data ? new Date(data.data) : new Date(),
      criadoPor: String(data.criadoPor)
    });

    return json({ message: 'Transação financeira registrada com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao registrar transação financeira.');
  }
}

export async function PUT({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID da transação é obrigatório para atualização.');
    }

    await db.update(financeiro)
      .set({
        tipo: data.tipo,
        descricao: data.descricao,
        valor: data.valor != null ? String(data.valor) : undefined,
        data: data.data ? new Date(data.data) : undefined
      })
      .where(eq(financeiro.id, data.id));

    return json({ message: 'Transação financeira atualizada com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao atualizar transação financeira.');
  }
}

export async function DELETE({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID da transação é obrigatório para exclusão.');
    }

    await db.delete(financeiro).where(eq(financeiro.id, data.id));

    return json({ message: 'Transação financeira removida com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao remover transação financeira.');
  }
}
