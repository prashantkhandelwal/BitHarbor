import { env } from '$env/dynamic/private';
import Database from 'better-sqlite3';
import { drizzle as createSqliteDatabase } from 'drizzle-orm/better-sqlite3';
import { drizzle as createPostgresDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const databaseType = env.DATABASE_TYPE?.toLowerCase() ?? 'sqlite';
const defaultCategories = ['Movies', 'Television', 'Games', 'Music', 'Applications', 'Anime', 'Documentaries', 'Other'];

function connect() {
  if (databaseType === 'sqlite') {
    const client = new Database(env.DATABASE_URL ?? 'bitharbor.db');
    client.pragma('journal_mode = WAL');
    client.exec(`
      CREATE TABLE IF NOT EXISTS categories (
        id text PRIMARY KEY,
        name text NOT NULL UNIQUE
      );
      CREATE TABLE IF NOT EXISTS users (
        id text PRIMARY KEY,
        username text NOT NULL UNIQUE,
        password_hash text NOT NULL,
        created_at text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS sessions (
        token_hash text PRIMARY KEY,
        user_id text NOT NULL,
        expires_at text NOT NULL
      );
      CREATE TABLE IF NOT EXISTS invites (
        code_hash text PRIMARY KEY,
        created_by text,
        used_by text,
        created_at text NOT NULL,
        used_at text
      );
      CREATE TABLE IF NOT EXISTS torrents (
        id text PRIMARY KEY,
        name text NOT NULL,
        info_hash text NOT NULL UNIQUE,
        files text NOT NULL,
        total_size integer NOT NULL,
        trackers text NOT NULL,
        piece_length integer NOT NULL,
        category_id text NOT NULL DEFAULT '',
        tags text NOT NULL DEFAULT '[]',
        description text NOT NULL DEFAULT '',
        created_at text NOT NULL
      )
    `);

    const torrentColumns = client.prepare('PRAGMA table_info(torrents)').all() as { name: string }[];
    const columnNames = new Set(torrentColumns.map((column) => column.name));
    if (!columnNames.has('category_id')) client.exec("ALTER TABLE torrents ADD COLUMN category_id text NOT NULL DEFAULT ''");
    if (!columnNames.has('tags')) client.exec("ALTER TABLE torrents ADD COLUMN tags text NOT NULL DEFAULT '[]'");
    if (!columnNames.has('description')) client.exec("ALTER TABLE torrents ADD COLUMN description text NOT NULL DEFAULT ''");

    const categoryCount = client.prepare('SELECT COUNT(*) AS count FROM categories').get() as { count: number };
    if (categoryCount.count === 0) {
      const insertCategory = client.prepare('INSERT INTO categories (id, name) VALUES (?, ?)');
      const seedCategories = client.transaction(() => {
        for (const name of defaultCategories) insertCategory.run(crypto.randomUUID(), name);
      });
      seedCategories();
    }

    return {
      type: 'sqlite' as const,
      db: createSqliteDatabase({ client })
    };
  }

  if (databaseType === 'postgres') {
    if (!env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when DATABASE_TYPE=postgres.');
    }

    const client = new Pool({ connectionString: env.DATABASE_URL });

    return {
      type: 'postgres' as const,
      db: createPostgresDatabase({ client })
    };
  }

  throw new Error('DATABASE_TYPE must be either sqlite or postgres.');
}

export const database = connect();