import { createTorrent } from '$lib/server/db/torrents';
import { torrentParser } from '$lib/server/torrent';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions } from './$types';

const maximumTorrentSize = 10 * 1024 * 1024;

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    const torrent = data.get('torrent');

    if (!(torrent instanceof File) || torrent.size === 0) {
      return fail(400, { message: 'Choose a .torrent file.' });
    }

    if (!torrent.name.endsWith('.torrent')) {
      return fail(400, { message: 'The selected file must use the .torrent extension.' });
    }

    if (torrent.size > maximumTorrentSize) {
      return fail(413, { message: 'The torrent file must be 10 MB or smaller.' });
    }

    let parsedTorrent;
    try {
      parsedTorrent = await torrentParser.parse(new Uint8Array(await torrent.arrayBuffer()));
    } catch {
      return fail(400, { message: 'The torrent file is invalid or could not be processed.' });
    }

    let result;
    try {
      result = await createTorrent(parsedTorrent);
    } catch (error) {
      console.error('Failed to store torrent metadata.', error);
      return fail(500, { message: 'The torrent metadata could not be stored.' });
    }

    redirect(303, `/torrents/${result.torrent.id}`);
  }
};