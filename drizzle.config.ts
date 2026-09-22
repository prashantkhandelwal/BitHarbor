import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

const databaseType = process.env.DATABASE_TYPE?.toLowerCase() ?? 'sqlite';

function createConfig() {
  if (databaseType === 'sqlite') {
    return defineConfig({
      dialect: 'sqlite',
      schema: './src/lib/server/db/schema.sqlite.ts',
      out: './drizzle/sqlite',
      dbCredentials: {
        url: process.env.DATABASE_URL ?? 'bitharbor.db'
      }
    });
  }

  if (databaseType === 'postgres') {
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL is required when DATABASE_TYPE=postgres.');
    }

    return defineConfig({
      dialect: 'postgresql',
      schema: './src/lib/server/db/schema.postgres.ts',
      out: './drizzle/postgres',
      dbCredentials: {
        url: process.env.DATABASE_URL
      }
    });
  }

  throw new Error('DATABASE_TYPE must be either sqlite or postgres.');
}

export default createConfig();