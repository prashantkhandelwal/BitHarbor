import { listTorrents } from '$lib/server/db/torrents';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
  const query = url.searchParams.get('q') ?? '';
  return { query, torrents: await listTorrents(query) };
};