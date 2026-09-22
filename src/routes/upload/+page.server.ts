import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';

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

    return fail(501, { message: 'Connect the parser, database, and object storage to enable uploads.' });
  }
};