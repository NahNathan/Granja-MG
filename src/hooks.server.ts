// src/hooks.server.ts
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { json, error } from '@sveltejs/kit';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import { eq } from 'drizzle-orm';
import { env } from '$env/dynamic/private';

const JWT_SECRET = env.JWT_SECRET || 'default_secret_key';

export async function handle({ event, resolve }) {
    const token = event.cookies.get('auth_token');

    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);

            // ✅ Garante que `decoded` seja um objeto e não uma string
            if (typeof decoded === 'object' && decoded !== null && 'id' in decoded) {
                const [existingUser] = await db
                    .select()
                    .from(user)
                    .where(eq(user.id, decoded.id));

                if (existingUser) {
                    event.locals.user = {
                        id: existingUser.id,
                        username: existingUser.username
                    };
                } else {
                    event.locals.user = null;
                }
            } else {
                event.locals.user = null;
            }
        } catch (err) {
            event.locals.user = null;
        }
    } else {
        event.locals.user = null;
    }

    return resolve(event);
}
