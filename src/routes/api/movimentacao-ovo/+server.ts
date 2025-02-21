import { db } from '$lib/server/db';
import { movimentacaoOvo } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { sql } from 'drizzle-orm';

// 🔹 GET: Buscar movimentações de ovos
export async function GET() {
    try {
        const movimentacoes = await db.select().from(movimentacaoOvo);
        return json(movimentacoes);
    } catch (err) {
        throw error(500, 'Erro ao buscar movimentações de ovos.');
    }
}

// 🔹 POST: Registrar uma movimentação de ovos
export async function POST({ request }) {
    try {
        const data = await request.json();

        if (!data.loteId || !data.tipo || !data.quantidade || !data.responsavelId) {
            throw error(400, 'Todos os campos são obrigatórios.');
        }

        await db.insert(movimentacaoOvo).values({
            id: crypto.randomUUID(), // 🔹 Gerar um ID único
            loteId: data.loteId,
            tipo: data.tipo,
            quantidade: data.quantidade,
            destino: data.destino || null,
            responsavelId: data.responsavelId,
            dataMovimentacao: new Date()
        });

        return json({ message: 'Movimentação registrada com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao registrar movimentação de ovos.');
    }
}

// 🔹 DELETE: Remover movimentação de ovos
export async function DELETE({ request }) {
    try {
        const data = await request.json();

        if (!data.id) {
            throw error(400, 'ID é obrigatório para exclusão.');
        }

        await db.execute(sql`DELETE FROM movimentacao_ovo WHERE id = ${data.id}`);

        return json({ message: 'Movimentação removida com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao remover movimentação de ovos.');
    }
}
