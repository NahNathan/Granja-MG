import { db } from '$lib/server/db';
import { loteOvo } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';

// 🔹 GET: Recuperar todos os lotes de ovos
export async function GET() {
    try {
        const lotes = await db.select().from(loteOvo);
        return json(lotes);
    } catch (err) {
        throw error(500, 'Erro ao buscar lotes de ovos no banco de dados.');
    }
}

// 🔹 POST: Adicionar um novo lote de ovos
export async function POST({ request }) {
    try {
        const data = await request.json();

        if (!data.animalId || !data.quantidade || !data.dataColeta) {
            throw error(400, 'Todos os campos são obrigatórios.');
        }

        await db.insert(loteOvo).values({
            id: crypto.randomUUID(), 
            animalId: data.animalId, 
            quantidade: data.quantidade, 
            dataColeta: new Date(data.dataColeta),
            atualizadoEm: new Date()
        });

        return json({ message: 'Lote de ovos adicionado com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao adicionar lote de ovos.');
    }
}

// 🔹 DELETE: Remover um lote de ovos
export async function DELETE({ request }) {
    try {
        const data = await request.json();

        if (!data.id) {
            throw error(400, 'ID é obrigatório para exclusão.');
        }

        await db.delete(loteOvo).where(eq(loteOvo.id, data.id));

        return json({ message: 'Lote de ovos removido com sucesso!' });
    } catch (err) {
        throw error(500, 'Erro ao remover lote de ovos.');
    }
}
