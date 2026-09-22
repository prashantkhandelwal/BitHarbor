import { eq } from 'drizzle-orm';
import type { Torrent } from '$lib/types';
import { database } from './index';
import { torrents as postgresTorrents } from './schema.postgres';
import { torrents as sqliteTorrents } from './schema.sqlite';

type PostgresTorrent = typeof postgresTorrents.$inferSelect;

function fromPostgres(torrent: PostgresTorrent): Torrent {
  return {
    ...torrent,
    createdAt: torrent.createdAt.toISOString()
  };
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