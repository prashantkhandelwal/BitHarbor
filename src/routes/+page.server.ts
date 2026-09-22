import { listTorrents } from '$lib/server/db/torrents';
import { requireUser } from '$lib/server/auth';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, url }) => {
  requireUser(locals.user, url.pathname);
  return { torrents: await listTorrents() };
};