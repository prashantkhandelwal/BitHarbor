import { listTorrents } from '$lib/server/db/torrents';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ locals, url }) => {
  if (!locals.user) error(401, 'Authentication required');
  return json(await listTorrents(url.searchParams.get('q') ?? ''));
};