import { redirect } from '@sveltejs/kit';

export const load = async ({ locals, url }) => {
  const user = locals.user;

  if (!user && url.pathname !== '/auth') {
    throw redirect(302, '/auth');
  }

  return { user };
};
