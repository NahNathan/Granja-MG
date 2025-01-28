import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';

if (!env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const client = await mysql.createConnection({
    uri: env.DATABASE_URL,
    multipleStatements: true  
});

export const db = drizzle(client);
