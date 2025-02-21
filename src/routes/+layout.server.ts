import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
    // Se não houver usuário e não estiver na página de login, redireciona
    if (!locals.user && url.pathname !== '/auth') {
        throw redirect(302, '/auth');
    }

    return { user: locals.user };
};
