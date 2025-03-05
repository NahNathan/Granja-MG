import { db } from '$lib/server/db';
import { venda } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// 🔹 GET: Recuperar todas as vendas
export async function GET() {
    try {
        const vendas = await db.select().from(venda);
        return json(vendas);
    } catch (err) {
        throw error(500, 'Erro ao buscar vendas.');
    }
}

// 🔹 POST: Adicionar uma nova venda
export async function POST({ request }) {
    try {
        const data = await request.json();

        if (!data.descricao || !data.comprador || !data.quantidade || !data.valorTotal || !data.metodoPagamento || !data.responsavelId) {
            throw error(400, 'Todos os campos são obrigatórios.');
        }

        await db.insert(venda).values({
            id: crypto.randomUUID(),  // 🔹 Gerar um UUID para a venda
            descricao: data.descricao,
            comprador: data.comprador,
            quantidade: data.quantidade,
            valorTotal: data.valorTotal,
            metodoPagamento: data.metodoPagamento,
            responsavelId: data.responsavelId,
            dataVenda: new Date()
        });

        return json({ message: 'Venda registrada com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao registrar venda.');
    }
}

// 🔹 PUT: Atualizar uma venda existente
export async function PUT({ request }) {
    try {
        const data = await request.json();

        if (!data.id) {
            throw error(400, 'ID da venda é obrigatório para atualização.');
        }

        await db.update(venda)
            .set({
                descricao: data.descricao,
                comprador: data.comprador,
                quantidade: data.quantidade,
                valorTotal: data.valorTotal,
                metodoPagamento: data.metodoPagamento
            })
            .where(eq(venda.id, data.id));

        return json({ message: 'Venda atualizada com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao atualizar venda.');
    }
}

// 🔹 DELETE: Remover uma venda
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
