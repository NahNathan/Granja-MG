import { db } from '$lib/server/db';
import { ovo } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';  // Importação correta

// Função para verificar se o usuário está autenticado
function verificarAutenticacao(user: any) {
  if (!user) {
    throw error(401, 'Usuário não autenticado.');
  }
}

// GET: Recuperar todos os registros de ovos
export async function GET({ locals }) {
  try {
    verificarAutenticacao(locals.user);

    const ovos = await db.select().from(ovo);
    return json(ovos);
  } catch (err) {
    throw error(500, 'Erro ao buscar ovos no banco de dados.');
  }
}

// POST: Adicionar um novo registro de ovos
export async function POST({ request, locals }) {
  try {
    verificarAutenticacao(locals.user);

    const data = await request.json();

    if (!data.tipoAnimal || data.guardados === undefined || data.embalados === undefined || data.vendidos === undefined) {
      throw error(400, 'Dados incompletos para adicionar ovos.');
    }

    await db.insert(ovo).values({
      tipoAnimal: data.tipoAnimal,
      guardados: data.guardados,
      embalados: data.embalados,
      vendidos: data.vendidos
    });

    return json({ message: 'Ovos adicionados com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao adicionar ovos no banco de dados.');
  }
}

// PUT: Atualizar um registro de ovos existente
export async function PUT({ request, locals }) {
  try {
    verificarAutenticacao(locals.user);

    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID do registro é obrigatório para atualização.');
    }

    await db.update(ovo)
      .set({
        guardados: data.guardados,
        embalados: data.embalados,
        vendidos: data.vendidos
      })
      .where(eq(ovo.id, data.id));

    return json({ message: 'Ovos atualizados com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao atualizar ovos no banco de dados.');
  }
}

// DELETE: Remover um registro de ovos
export async function DELETE({ request, locals }) {
  try {
    verificarAutenticacao(locals.user);

    const data = await request.json();

    if (!data.id) {
      throw error(400, 'ID do registro é obrigatório para exclusão.');
    }

    await db.delete(ovo)
      .where(eq(ovo.id, data.id));

    return json({ message: 'Ovos removidos com sucesso!' });
  } catch (err) {
    throw error(500, 'Erro ao remover ovos do banco de dados.');
  }
}
