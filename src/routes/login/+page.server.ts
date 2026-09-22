import { authenticateUser, createSession, sessionCookieName, sessionDurationSeconds } from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

function redirectTarget(value: string | null): string {
  return value?.startsWith('/') && !value.startsWith('//') ? value : '/';
}

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) redirect(303, '/');
};

export const actions: Actions = {
  default: async ({ cookies, request, url }) => {
    const data = await request.formData();
    const username = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const user = await authenticateUser(username, password);

    if (!user) return fail(400, { message: 'Invalid username or password.', username });

    const token = await createSession(user.id);
    cookies.set(sessionCookieName, token, {
      path: '/',
      httpOnly: true,
      sameSite: 'lax',
      secure: url.protocol === 'https:',
      maxAge: sessionDurationSeconds
    });
    redirect(303, redirectTarget(url.searchParams.get('redirect')));
  }
};