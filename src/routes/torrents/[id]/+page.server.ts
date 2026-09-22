import { getTorrent } from '$lib/server/db/torrents';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params }) => {
  const torrent = await getTorrent(params.id);

  if (!torrent) {
    error(404, 'Torrent not found');
  }

  return { torrent };
};