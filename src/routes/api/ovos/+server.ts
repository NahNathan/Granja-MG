import { db } from '$lib/server/db';
import { ovo } from '$lib/server/db/schema';
import { json } from '@sveltejs/kit';

export async function GET() {
  const ovos = await db.select().from(ovo);
  return json(ovos);
}
