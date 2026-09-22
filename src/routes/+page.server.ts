import { listTorrents } from '$lib/server/db/torrents';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
  return { torrents: await listTorrents() };
};