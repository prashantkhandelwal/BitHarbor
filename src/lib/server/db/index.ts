import { env } from '$env/dynamic/private';
import Database from 'better-sqlite3';
import { drizzle as createSqliteDatabase } from 'drizzle-orm/better-sqlite3';
import { drizzle as createPostgresDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

const databaseType = env.DATABASE_TYPE?.toLowerCase() ?? 'sqlite';

function connect() {
  if (databaseType === 'sqlite') {
    const client = new Database(env.DATABASE_URL ?? 'bitharbor.db');
    client.pragma('journal_mode = WAL');
    client.exec(`
      CREATE TABLE IF NOT EXISTS torrents (
        id text PRIMARY KEY,
        name text NOT NULL,
        info_hash text NOT NULL UNIQUE,
        files text NOT NULL,
        total_size integer NOT NULL,
        trackers text NOT NULL,
        piece_length integer NOT NULL,
        created_at text NOT NULL
      )
    `);

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