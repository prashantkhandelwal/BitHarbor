import { deleteSession, sessionCookieName } from '$lib/server/auth';
import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ cookies }) => {
  const token = cookies.get(sessionCookieName);
  if (token) await deleteSession(token);
  cookies.delete(sessionCookieName, { path: '/' });
  redirect(303, '/');
};