import type { TorrentFile } from '$lib/types';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const torrents = sqliteTable('torrents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  infoHash: text('info_hash').notNull().unique(),
  files: text('files', { mode: 'json' }).$type<TorrentFile[]>().notNull(),
  totalSize: integer('total_size').notNull(),
  trackers: text('trackers', { mode: 'json' }).$type<string[]>().notNull(),
  pieceLength: integer('piece_length').notNull(),
  categoryId: text('category_id').notNull(),
  tags: text('tags', { mode: 'json' }).$type<string[]>().notNull(),
  description: text('description').notNull(),
  createdAt: text('created_at').notNull()
});

export const categories = sqliteTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
});

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  createdAt: text('created_at').notNull()
});

export const sessions = sqliteTable('sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: text('expires_at').notNull()
});

export const invites = sqliteTable('invites', {
  codeHash: text('code_hash').primaryKey(),
  createdBy: text('created_by'),
  usedBy: text('used_by'),
  createdAt: text('created_at').notNull(),
  usedAt: text('used_at')
});