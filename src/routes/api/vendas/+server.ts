import { db } from '$lib/server/db';
import { venda } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const vendas = await db.select().from(venda);
    return json(vendas);
  } catch (err) {
    throw error(500, 'Erro ao buscar vendas.');
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    if (
      !data.animalId ||
      !data.descricao ||
      !data.comprador ||
      data.quantidade == null ||
      data.valorTotal == null ||
      !data.metodoPagamento ||
      !data.responsavelId
    ) {
      throw error(400, 'animalId, descricao, comprador, quantidade, valorTotal, metodoPagamento e responsavelId são obrigatórios.');
    }

    await db.insert(venda).values({
      id: crypto.randomUUID(),
      animalId: String(data.animalId),
      descricao: String(data.descricao),
      comprador: String(data.comprador),
      quantidade: Number(data.quantidade),
      valorTotal: String(data.valorTotal),
      metodoPagamento: String(data.metodoPagamento),
      responsavelId: String(data.responsavelId),
      dataVenda: data.dataVenda ? new Date(data.dataVenda) : new Date()
    });

    return json({ message: 'Venda registrada com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao registrar venda.');
  }
}

export async function PUT({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID da venda é obrigatório para atualização.');
    }

    await db.update(venda)
      .set({
        animalId: data.animalId ?? undefined,
        descricao: data.descricao ?? undefined,
        comprador: data.comprador ?? undefined,
        quantidade: data.quantidade != null ? Number(data.quantidade) : undefined,
        valorTotal: data.valorTotal != null ? String(data.valorTotal) : undefined,
        metodoPagamento: data.metodoPagamento ?? undefined,
        dataVenda: data.dataVenda ? new Date(data.dataVenda) : undefined
      })
      .where(eq(venda.id, data.id));

    return json({ message: 'Venda atualizada com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao atualizar venda.');
  }
}

export async function DELETE({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID da venda é obrigatório para exclusão.');
    }

    await db.delete(venda).where(eq(venda.id, data.id));

    return json({ message: 'Venda removida com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao remover venda.');
  }
}
