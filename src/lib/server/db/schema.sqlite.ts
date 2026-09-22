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
  createdAt: text('created_at').notNull()
});