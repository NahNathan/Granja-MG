import {
    mysqlTable,
    serial,
    text,
    int,
    varchar,
    datetime,
    decimal,
    boolean
} from 'drizzle-orm/mysql-core';
import { sql } from 'drizzle-orm/sql/sql';

// === Tabela de Usuários (Auth) ===
export const user = mysqlTable('user', {
    id: varchar('id', { length: 255 }).primaryKey(),
    username: varchar('username', { length: 32 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    age: int('age'),
    role: varchar('role', { length: 32 }).default('user') // 'user' ou 'admin'
});

// === Tabela de Sessões ===
export const session = mysqlTable('session', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id),
    expiresAt: datetime('expires_at').notNull()
});

// === Tabela de Animais ===
export const animal = mysqlTable('animal', {
    id: varchar('id', { length: 255 }).primaryKey(),  
    nome: varchar('nome', { length: 64 }).notNull(),
    tipo: varchar('tipo', { length: 32 }).notNull(),
    quantidade: int('quantidade').notNull(),
    galpao: varchar('galpao', { length: 64 }).notNull(),
    ativo: boolean('ativo').default(true)
});

// === Tabela de Lotes de Ovos ===
export const loteOvo = mysqlTable('lote_ovo', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    animalId: varchar('animal_id', { length: 255 }).notNull().references(() => animal.id), // 🔹 Agora também VARCHAR(255)
    quantidade: int('quantidade').notNull(),
    dataColeta: datetime('data_coleta').notNull(),
    atualizadoEm: datetime('atualizado_em').default(sql`now()`)
});

// === Tabela de Movimentação dos Ovos ===
export const movimentacaoOvo = mysqlTable('movimentacao_ovo', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    loteId: varchar('lote_id', { length: 255 }).notNull().references(() => loteOvo.id), // 🔹 Agora VARCHAR(255)
    tipo: varchar('tipo', { length: 32 }).notNull(),
    quantidade: int('quantidade').notNull(),
    destino: varchar('destino', { length: 64 }),
    responsavelId: varchar('responsavel_id', { length: 255 }).notNull().references(() => user.id),
    dataMovimentacao: datetime('data_movimentacao').default(sql`now()`)
});

// === Tabela de Insumos ===
export const insumo = mysqlTable('insumo', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    nome: varchar('nome', { length: 64 }).notNull(),
    quantidade: int('quantidade').notNull(),
    unidade: varchar('unidade', { length: 16 }).notNull(),
    atualizadoEm: datetime('atualizado_em').default(sql`now()`)
});

// === Tabela de Clientes ===
export const cliente = mysqlTable('cliente', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    nome: varchar('nome', { length: 64 }).notNull(),
    telefone: varchar('telefone', { length: 16 }),
    email: varchar('email', { length: 128 }),
    endereco: text('endereco')
});

// === Tabela de Vendas ===
export const venda = mysqlTable('venda', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    descricao: varchar('descricao', { length: 128 }).notNull(),
    comprador: varchar('comprador', { length: 64 }).notNull(),
    quantidade: int('quantidade').notNull(),
    valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).notNull(),
    metodoPagamento: varchar('metodo_pagamento', { length: 16 }).notNull(),
    dataVenda: datetime('data_venda').default(sql`now()`),
    responsavelId: varchar('responsavel_id', { length: 255 }).notNull().references(() => user.id)
});

// === Tabela de Financeiro ===
export const financeiro = mysqlTable('financeiro', {
    id: varchar('id', { length: 255 }).primaryKey(), // 🔹 Agora VARCHAR(255)
    tipo: varchar('tipo', { length: 16 }).notNull(),
    descricao: varchar('descricao', { length: 128 }).notNull(),
    valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
    data: datetime('data').default(sql`now()`),
    categoria: varchar('categoria', { length: 64 }),
    criadoPor: varchar('criado_por', { length: 255 }).notNull().references(() => user.id)
});

// Tipos para TypeScript
export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Animal = typeof animal.$inferSelect;
export type LoteOvo = typeof loteOvo.$inferSelect;
export type MovimentacaoOvo = typeof movimentacaoOvo.$inferSelect;
export type Insumo = typeof insumo.$inferSelect;
export type Cliente = typeof cliente.$inferSelect;
export type Venda = typeof venda.$inferSelect;
export type Financeiro = typeof financeiro.$inferSelect;
