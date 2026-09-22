import { createTorrent } from '$lib/server/db/torrents';
import { getCategory, listCategories } from '$lib/server/db/categories';
import { requireUser } from '$lib/server/auth';
import { torrentParser } from '$lib/server/torrent';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const maximumTorrentSize = 10 * 1024 * 1024;

export const load: PageServerLoad = async ({ locals, url }) => {
  requireUser(locals.user, url.pathname);
  return { categories: await listCategories() };
};

export const actions: Actions = {
  default: async ({ locals, request, url }) => {
    requireUser(locals.user, url.pathname);
    const data = await request.formData();
    const torrent = data.get('torrent');
    const categoryId = String(data.get('categoryId') ?? '');
    const tagsValue = String(data.get('tags') ?? '');
    const description = String(data.get('description') ?? '').trim();
    const values = { categoryId, tags: tagsValue, description };

    if (!categoryId || !(await getCategory(categoryId))) {
      return fail(400, { message: 'Select a valid category.', values });
    }

    if (!(torrent instanceof File) || torrent.size === 0) {
      return fail(400, { message: 'Choose a .torrent file.', values });
    }

    if (!torrent.name.endsWith('.torrent')) {
      return fail(400, { message: 'The selected file must use the .torrent extension.', values });
    }

    if (torrent.size > maximumTorrentSize) {
      return fail(413, { message: 'The torrent file must be 10 MB or smaller.', values });
    }

    let parsedTorrent;
    try {
      parsedTorrent = await torrentParser.parse(new Uint8Array(await torrent.arrayBuffer()));
    } catch {
      return fail(400, { message: 'The torrent file is invalid or could not be processed.', values });
    }

    const tags = [...new Set(tagsValue.split(',').map((tag) => tag.trim()).filter(Boolean))];

    let result;
    try {
      result = await createTorrent({ ...parsedTorrent, categoryId, tags, description });
    } catch (error) {
      console.error('Failed to store torrent metadata.', error);
      return fail(500, { message: 'The torrent metadata could not be stored.', values });
    }

    redirect(303, `/torrents/${result.torrent.id}`);
  }
};