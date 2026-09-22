import { asc, eq } from 'drizzle-orm';
import type { Category } from '$lib/types';
import { database } from './index';
import { categories as postgresCategories, torrents as postgresTorrents } from './schema.postgres';
import { categories as sqliteCategories, torrents as sqliteTorrents } from './schema.sqlite';

export async function listCategories(): Promise<Category[]> {
  if (database.type === 'sqlite') {
    return database.db.select().from(sqliteCategories).orderBy(asc(sqliteCategories.name));
  }

  return database.db.select().from(postgresCategories).orderBy(asc(postgresCategories.name));
}

export async function getCategory(id: string): Promise<Category | undefined> {
  if (database.type === 'sqlite') {
    return database.db.select().from(sqliteCategories).where(eq(sqliteCategories.id, id)).get();
  }

  const [category] = await database.db
    .select()
    .from(postgresCategories)
    .where(eq(postgresCategories.id, id))
    .limit(1);
  return category;
}

export async function createCategory(name: string): Promise<Category> {
  const category = { id: crypto.randomUUID(), name };

  if (database.type === 'sqlite') {
    return database.db.insert(sqliteCategories).values(category).returning().get();
  }

  const [created] = await database.db.insert(postgresCategories).values(category).returning();
  return created;
}

export async function updateCategory(id: string, name: string): Promise<Category | undefined> {
  if (database.type === 'sqlite') {
    return database.db
      .update(sqliteCategories)
      .set({ name })
      .where(eq(sqliteCategories.id, id))
      .returning()
      .get();
  }

  const [updated] = await database.db
    .update(postgresCategories)
    .set({ name })
    .where(eq(postgresCategories.id, id))
    .returning();
  return updated;
}

export async function deleteCategory(id: string): Promise<'deleted' | 'in-use' | 'not-found'> {
  if (database.type === 'sqlite') {
    const torrent = database.db
      .select({ id: sqliteTorrents.id })
      .from(sqliteTorrents)
      .where(eq(sqliteTorrents.categoryId, id))
      .get();
    if (torrent) return 'in-use';

    const deleted = database.db
      .delete(sqliteCategories)
      .where(eq(sqliteCategories.id, id))
      .returning({ id: sqliteCategories.id })
      .get();
    return deleted ? 'deleted' : 'not-found';
  }

  const [torrent] = await database.db
    .select({ id: postgresTorrents.id })
    .from(postgresTorrents)
    .where(eq(postgresTorrents.categoryId, id))
    .limit(1);
  if (torrent) return 'in-use';

  const [deleted] = await database.db
    .delete(postgresCategories)
    .where(eq(postgresCategories.id, id))
    .returning({ id: postgresCategories.id });
  return deleted ? 'deleted' : 'not-found';
}