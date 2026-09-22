import {
  createSession,
  InvalidInviteError,
  registerUser,
  sessionCookieName,
  sessionDurationSeconds,
  UsernameTakenError
} from '$lib/server/auth';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const usernamePattern = /^[a-zA-Z0-9_]{3,32}$/;

export const load: PageServerLoad = ({ locals }) => {
  if (locals.user) redirect(303, '/');
};

export const actions: Actions = {
  default: async ({ cookies, request, url }) => {
    const data = await request.formData();
    const username = String(data.get('username') ?? '').trim();
    const password = String(data.get('password') ?? '');
    const inviteCode = String(data.get('inviteCode') ?? '').trim();

    if (!usernamePattern.test(username)) {
      return fail(400, { message: 'Username must be 3-32 characters using letters, numbers, or underscores.', username });
    }
    if (password.length < 8 || password.length > 128) {
      return fail(400, { message: 'Password must be between 8 and 128 characters.', username });
    }
    if (!inviteCode) return fail(400, { message: 'An invite code is required.', username });

    try {
      const user = await registerUser(username, password, inviteCode);
      const token = await createSession(user.id);
      cookies.set(sessionCookieName, token, {
        path: '/',
        httpOnly: true,
        sameSite: 'lax',
        secure: url.protocol === 'https:',
        maxAge: sessionDurationSeconds
      });
    } catch (error) {
      if (error instanceof InvalidInviteError) return fail(400, { message: 'The invite code is invalid or has already been used.', username });
      if (error instanceof UsernameTakenError) return fail(400, { message: 'That username is already registered.', username });
      throw error;
    }

    redirect(303, '/');
  }
};