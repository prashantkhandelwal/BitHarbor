import type { TorrentFile } from '$lib/types';
import { bigint, integer, jsonb, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const torrents = pgTable('torrents', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  infoHash: text('info_hash').notNull().unique(),
  files: jsonb('files').$type<TorrentFile[]>().notNull(),
  totalSize: bigint('total_size', { mode: 'number' }).notNull(),
  trackers: jsonb('trackers').$type<string[]>().notNull(),
  pieceLength: integer('piece_length').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull()
});