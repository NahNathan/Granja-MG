import {
    mysqlTable,
    serial,
    text,
    int,
    varchar,
    datetime,
    decimal,
    boolean,
    unique
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
    userId: varchar('user_id', { length: 255 })
        .notNull()
        .references(() => user.id),
    expiresAt: datetime('expires_at').notNull()
});

// === Tabela de Animais ===
export const animal = mysqlTable('animal', {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(), // Ex: "Galinha Poedeira"
    tipo: varchar('tipo', { length: 32 }).notNull(), // Ex: "galinha", "codorna"
    quantidade: int('quantidade').notNull(),
    galpao: varchar('galpao', { length: 64 }).notNull(), // Identificação do galpão
    ativo: boolean('ativo').default(true) // Indica se o grupo de animais está ativo
});

// === Tabela de Ovos ===
export const ovo = mysqlTable('ovo', {
    id: serial('id').primaryKey(),
    tipoAnimal: varchar('tipo_animal', { length: 32 }).notNull(), // Ex: "galinha", "codorna"
    guardados: int('guardados').default(0), // Quantidade de ovos guardados
    embalados: int('embalados').default(0), // Quantidade de ovos embalados
    vendidos: int('vendidos').default(0), // Quantidade de ovos vendidos
    atualizadoEm: datetime('atualizado_em').default(sql`now()`)
});

// === Tabela de Insumos ===
export const insumo = mysqlTable('insumo', {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(), // Ex: "Ração", "Bandejas"
    quantidade: int('quantidade').notNull(),
    unidade: varchar('unidade', { length: 16 }).notNull(), // Ex: "kg", "unidade"
    atualizadoEm: datetime('atualizado_em').default(sql`now()`)
});

// === Tabela de Clientes ===
export const cliente = mysqlTable('cliente', {
    id: serial('id').primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    telefone: varchar('telefone', { length: 16 }),
    email: varchar('email', { length: 128 }),
    endereco: text('endereco')
});

// === Tabela de Vendas ===
export const venda = mysqlTable('venda', {
    id: serial('id').primaryKey(),
    descricao: varchar('descricao', { length: 128 }).notNull(), // Ex: "Venda de ovos embalados"
    comprador: varchar('comprador', { length: 64 }).notNull(), // Nome do comprador
    quantidade: int('quantidade').notNull(),
    valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).notNull(), // Ex: "150.50"
    metodoPagamento: varchar('metodo_pagamento', { length: 16 }).notNull(), // Ex: "dinheiro", "cartão", "pix"
    dataVenda: datetime('data_venda').default(sql`now()`),
    responsavelId: varchar('responsavel_id', { length: 255 }) // FK para user.id
        .notNull()
        .references(() => user.id)
});

// === Tabela de Financeiro ===
export const financeiro = mysqlTable('financeiro', {
    id: serial('id').primaryKey(),
    tipo: varchar('tipo', { length: 16 }).notNull(), // Ex: "receita", "despesa"
    descricao: varchar('descricao', { length: 128 }).notNull(),
    valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
    data: datetime('data').default(sql`now()`),
    categoria: varchar('categoria', { length: 64 }), // Ex: "Ração", "Manutenção"
    criadoPor: varchar('criado_por', { length: 255 }) // FK para user.id
        .notNull()
        .references(() => user.id)
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type Animal = typeof animal.$inferSelect;
export type Ovo = typeof ovo.$inferSelect;
export type Insumo = typeof insumo.$inferSelect;
export type Cliente = typeof cliente.$inferSelect;
export type Venda = typeof venda.$inferSelect;
export type Financeiro = typeof financeiro.$inferSelect;
