import { createInvite, requireUser } from '$lib/server/auth';
import { error } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
  const user = requireUser(locals.user, url.pathname);
  if (!user.isPremium) error(403, 'You do not have permission to create invites.');
};

export const actions: Actions = {
  default: async ({ locals, url }) => {
    const user = requireUser(locals.user, url.pathname);
    if (!user.isPremium) error(403, 'You do not have permission to create invites.');
    return { inviteCode: await createInvite(user.id) };
  }
};