import { ensureInitialInvite, sessionCookieName, validateSession } from '$lib/server/auth';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  await ensureInitialInvite();
  const token = event.cookies.get(sessionCookieName);
  event.locals.user = token ? await validateSession(token) : null;
  return resolve(event);
};