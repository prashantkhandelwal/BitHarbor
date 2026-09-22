import { getTorrent } from '$lib/server/db/torrents';
import { requireUser } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, params, url }) => {
  requireUser(locals.user, url.pathname);
  const torrent = await getTorrent(params.id);

  if (!torrent) {
    error(404, 'Torrent not found');
  }

  return { torrent };
};