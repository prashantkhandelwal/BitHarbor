import { eq } from 'drizzle-orm';
import type { Torrent } from '$lib/types';
import { database } from './index';
import { torrents as postgresTorrents } from './schema.postgres';
import { torrents as sqliteTorrents } from './schema.sqlite';

type PostgresTorrent = typeof postgresTorrents.$inferSelect;
type NewTorrent = Omit<Torrent, 'id' | 'createdAt'>;

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

  return normalizedQuery
    ? torrents.filter((torrent) => torrent.name.toLowerCase().includes(normalizedQuery))
    : torrents;
}

export async function getTorrent(id: string): Promise<Torrent | undefined> {
  if (database.type === 'sqlite') {
    return database.db.select().from(sqliteTorrents).where(eq(sqliteTorrents.id, id)).get();
  }

  const torrent = await database.db
    .select()
    .from(postgresTorrents)
    .where(eq(postgresTorrents.id, id))
    .limit(1);

  return torrent[0] ? fromPostgres(torrent[0]) : undefined;
}