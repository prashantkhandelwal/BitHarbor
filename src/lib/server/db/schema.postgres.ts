import type { TorrentFile } from '$lib/types';
import { bigint, boolean, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const torrents = pgTable('torrents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  infoHash: text('info_hash').notNull().unique(),
  files: jsonb('files').$type<TorrentFile[]>().notNull(),
  totalSize: bigint('total_size', { mode: 'number' }).notNull(),
  trackers: jsonb('trackers').$type<string[]>().notNull(),
  pieceLength: integer('piece_length').notNull(),
  categoryId: text('category_id').notNull(),
  tags: jsonb('tags').$type<string[]>().notNull(),
  description: text('description').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const categories = pgTable('categories', {
  id: text('id').primaryKey(),
  name: text('name').notNull().unique()
});

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  username: text('username').notNull().unique(),
  passwordHash: text('password_hash').notNull(),
  isAdmin: boolean('is_admin').notNull().default(false),
  isPremium: boolean('is_premium').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});

export const sessions = pgTable('sessions', {
  tokenHash: text('token_hash').primaryKey(),
  userId: text('user_id').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull()
});

export const invites = pgTable('invites', {
  codeHash: text('code_hash').primaryKey(),
  createdBy: text('created_by'),
  usedBy: text('used_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  usedAt: timestamp('used_at', { withTimezone: true })
});