export const prerender = true;
import { db } from '$lib/server/db';
import { ovo } from '$lib/server/db/schema';

export async function load() {
  const ovos = await db.select().from(ovo);
  return { ovos };
}
