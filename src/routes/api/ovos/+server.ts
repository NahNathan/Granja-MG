import { db } from '$lib/server/db';
import { coletaOvo } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const coletas = await db.select().from(coletaOvo);
    return json(coletas);
  } catch (err) {
    throw error(500, 'Erro ao buscar coletas de ovos.');
  }
}

export async function POST({ request }) {
  try {
    const data = await request.json();

    if (!data.animalId || data.quantidade == null || !data.dataColeta) {
      throw error(400, 'animalId, quantidade e dataColeta são obrigatórios.');
    }

    await db.insert(coletaOvo).values({
      id: crypto.randomUUID(),
      animalId: String(data.animalId),
      quantidade: Number(data.quantidade),
      dataColeta: new Date(data.dataColeta),
      observacao: data.observacao ?? null
    });

    return json({ message: 'Coleta registrada com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao registrar coleta de ovos.');
  }
}

export async function DELETE({ request }) {
  try {
    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID é obrigatório para exclusão.');
    }

    await db.delete(coletaOvo).where(eq(coletaOvo.id, data.id));

    return json({ message: 'Coleta removida com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao remover coleta de ovos.');
  }
}
