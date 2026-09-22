import { eq } from 'drizzle-orm';
import type { Torrent } from '$lib/types';
import type { ParsedTorrent } from '$lib/server/torrent';
import { listCategories } from './categories';
import { database } from './index';
import { torrents as postgresTorrents } from './schema.postgres';
import { torrents as sqliteTorrents } from './schema.sqlite';

type PostgresTorrent = typeof postgresTorrents.$inferSelect;
type NewTorrent = ParsedTorrent & Pick<Torrent, 'categoryId' | 'tags' | 'description'>;

export type CreateTorrentResult = {
  torrent: Torrent;
  created: boolean;
};

function fromPostgres(torrent: PostgresTorrent): Torrent {
  return {
    ...torrent,
    createdAt: torrent.createdAt.toISOString()
  };
}

export async function createTorrent(torrent: NewTorrent): Promise<CreateTorrentResult> {
  const id = crypto.randomUUID();

  if (database.type === 'sqlite') {
    const inserted = database.db
      .insert(sqliteTorrents)
      .values({ ...torrent, id, createdAt: new Date().toISOString() })
      .onConflictDoNothing({ target: sqliteTorrents.infoHash })
      .returning()
      .get();

    if (inserted) {
      return { torrent: inserted, created: true };
    }

    const existing = database.db
      .select()
      .from(sqliteTorrents)
      .where(eq(sqliteTorrents.infoHash, torrent.infoHash))
      .get();

    if (!existing) {
      throw new Error('The torrent could not be created.');
    }

    return { torrent: existing, created: false };
  }

  const [inserted] = await database.db
    .insert(postgresTorrents)
    .values({ ...torrent, id })
    .onConflictDoNothing({ target: postgresTorrents.infoHash })
    .returning();

  if (inserted) {
    return { torrent: fromPostgres(inserted), created: true };
  }

  const [existing] = await database.db
    .select()
    .from(postgresTorrents)
    .where(eq(postgresTorrents.infoHash, torrent.infoHash))
    .limit(1);

  if (!existing) {
    throw new Error('The torrent could not be created.');
  }

  return { torrent: fromPostgres(existing), created: false };
}

export async function listTorrents(query = ''): Promise<Torrent[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const torrents =
    database.type === 'sqlite'
      ? await database.db.select().from(sqliteTorrents)
      : (await database.db.select().from(postgresTorrents)).map(fromPostgres);

  const categories = new Map((await listCategories()).map((category) => [category.id, category.name]));
  const results = normalizedQuery
    ? torrents.filter((torrent) => torrent.name.toLowerCase().includes(normalizedQuery))
    : torrents;

  return results.map((torrent) => ({ ...torrent, categoryName: categories.get(torrent.categoryId) }));
}

export async function getTorrent(id: string): Promise<Torrent | undefined> {
  if (database.type === 'sqlite') {
    const torrent = database.db.select().from(sqliteTorrents).where(eq(sqliteTorrents.id, id)).get();
    if (!torrent) return undefined;
    const categories = new Map((await listCategories()).map((category) => [category.id, category.name]));
    return { ...torrent, categoryName: categories.get(torrent.categoryId) };
  }

  const torrent = await database.db
    .select()
    .from(postgresTorrents)
    .where(eq(postgresTorrents.id, id))
    .limit(1);

  if (!torrent[0]) return undefined;
  const categories = new Map((await listCategories()).map((category) => [category.id, category.name]));
  const result = fromPostgres(torrent[0]);
  return { ...result, categoryName: categories.get(result.categoryId) };
}