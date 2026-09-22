import { listTorrents } from '$lib/server/db/torrents';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
  return json(await listTorrents(url.searchParams.get('q') ?? ''));
};