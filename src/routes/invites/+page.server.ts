import { createInvite, requireUser } from '$lib/server/auth';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = ({ locals, url }) => {
  requireUser(locals.user, url.pathname);
};

export const actions: Actions = {
  default: async ({ locals, url }) => {
    const user = requireUser(locals.user, url.pathname);
    return { inviteCode: await createInvite(user.id) };
  }
};