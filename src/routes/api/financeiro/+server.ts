import { db } from '$lib/server/db';
import { financeiro } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// 🔹 GET: Recuperar todas as transações financeiras
export async function GET() {
    try {
        const transacoes = await db.select().from(financeiro);
        return json(transacoes);
    } catch (err) {
        throw error(500, 'Erro ao buscar transações financeiras.');
    }
}

// 🔹 POST: Adicionar uma nova transação financeira (receita ou despesa)
export async function POST({ request }) {
    try {
        const data = await request.json();

        if (!data.tipo || !data.descricao || !data.valor || !data.criadoPor) {
            throw error(400, 'Todos os campos obrigatórios devem ser preenchidos.');
        }

        await db.insert(financeiro).values({
            id: crypto.randomUUID(), // 🔹 Gera um ID automaticamente
            tipo: data.tipo, // "receita" ou "despesa"
            descricao: data.descricao,
            valor: data.valor,
            categoria: data.categoria || null, // Pode ser opcional
            criadoPor: data.criadoPor, // ID do usuário que criou a transação
            data: new Date() // 🔹 Data atual da criação
        });

        return json({ message: 'Transação financeira registrada com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao registrar transação financeira.');
    }
}

// 🔹 PUT: Atualizar uma transação existente
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
                valor: data.valor,
                categoria: data.categoria
            })
            .where(eq(financeiro.id, data.id));

        return json({ message: 'Transação financeira atualizada com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao atualizar transação financeira.');
    }
}

// 🔹 DELETE: Remover uma transação financeira
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
