import {
    mysqlTable,
    varchar,
    int,
    boolean,
    datetime,
    decimal,
    text,
    index
  } from 'drizzle-orm/mysql-core';
  import { sql } from 'drizzle-orm/sql/sql';
    
  //AUTH
  
  export const user = mysqlTable('user', {
    id: varchar('id', { length: 255 }).primaryKey(),
    username: varchar('username', { length: 32 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }).notNull(),
    age: int('age'),
    role: varchar('role', { length: 32 }).default('user')
  });
  
  export const session = mysqlTable('session', {
    id: varchar('id', { length: 255 }).primaryKey(),
    userId: varchar('user_id', { length: 255 }).notNull().references(() => user.id),
    expiresAt: datetime('expires_at').notNull()
  });
  
  //ANIMAIS
  
  export const animal = mysqlTable(
    'animal',
    {
      id: varchar('id', { length: 255 }).primaryKey(),
      nome: varchar('nome', { length: 64 }).notNull(), 
      tipo: varchar('tipo', { length: 32 }).notNull(),   
      quantidade: int('quantidade').notNull(),           
      galpao: varchar('galpao', { length: 64 }).notNull(),
      ativo: boolean('ativo').default(true),
      criadoEm: datetime('criado_em').default(sql`now()`),
      atualizadoEm: datetime('atualizado_em').default(sql`now()`)
    },
    (table) => ({
      idxTipo: index('animal_tipo_idx').on(table.tipo),
      idxGalpao: index('animal_galpao_idx').on(table.galpao)
    })
  );
  
  //COLETA DIÁRIA DE OVOS
  export const coletaOvo = mysqlTable(
    'coleta_ovo',
    {
      id: varchar('id', { length: 255 }).primaryKey(),
      animalId: varchar('animal_id', { length: 255 }).notNull().references(() => animal.id),
      quantidade: int('quantidade').notNull(),                 
      dataColeta: datetime('data_coleta').notNull(),           
      observacao: text('observacao'),                         
      criadoEm: datetime('criado_em').default(sql`now()`),
      atualizadoEm: datetime('atualizado_em').default(sql`now()`)
    },
    (table) => ({
      idxAnimalData: index('coleta_animal_data_idx').on(table.animalId, table.dataColeta)
    })
  );
  
  
  export const financeiro = mysqlTable(
    'financeiro',
    {
      id: varchar('id', { length: 255 }).primaryKey(),
      tipo: varchar('tipo', { length: 64 }).notNull(),
      descricao: varchar('descricao', { length: 128 }).notNull(),
      valor: decimal('valor', { precision: 10, scale: 2 }).notNull(),
      data: datetime('data').default(sql`now()`),
      criadoPor: varchar('criado_por', { length: 255 }).notNull().references(() => user.id)
    },
    (table) => ({
      idxTipo: index('fin_tipo_idx').on(table.tipo)
    })
  );
  
    
  /*export const cliente = mysqlTable('cliente', {
    id: varchar('id', { length: 255 }).primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    telefone: varchar('telefone', { length: 16 }),
    email: varchar('email', { length: 128 }),
    endereco: text('endereco')
  }); */
  
  export const insumo = mysqlTable('insumo', {
    id: varchar('id', { length: 255 }).primaryKey(),
    nome: varchar('nome', { length: 64 }).notNull(),
    quantidade: int('quantidade').notNull(),
    unidade: varchar('unidade', { length: 16 }).notNull(),  
    atualizadoEm: datetime('atualizado_em').default(sql`now()`)
  });
  
  //VENDAS
  export const venda = mysqlTable(
    'venda',
    {
      id: varchar('id', { length: 255 }).primaryKey(),
      animalId: varchar('animal_id', { length: 255 }).notNull().references(() => animal.id), 
      descricao: varchar('descricao', { length: 128 }).notNull(), 
      comprador: varchar('comprador', { length: 64 }).notNull(),
      quantidade: int('quantidade').notNull(),             
      valorTotal: decimal('valor_total', { precision: 10, scale: 2 }).notNull(),
      metodoPagamento: varchar('metodo_pagamento', { length: 16 }).notNull(),
      dataVenda: datetime('data_venda').default(sql`now()`),
      responsavelId: varchar('responsavel_id', { length: 255 }).notNull().references(() => user.id)
    },
    (table) => ({
      idxAnimal: index('venda_animal_idx').on(table.animalId),
      idxData: index('venda_data_idx').on(table.dataVenda)
    })
  );
  
  //Tipos TS
  
  export type User = typeof user.$inferSelect;
  export type Session = typeof session.$inferSelect;
  export type Animal = typeof animal.$inferSelect;
  export type ColetaOvo = typeof coletaOvo.$inferSelect;
  export type Insumo = typeof insumo.$inferSelect;
  //export type Cliente = typeof cliente.$inferSelect;
  export type Venda = typeof venda.$inferSelect;
  export type Financeiro = typeof financeiro.$inferSelect;
  