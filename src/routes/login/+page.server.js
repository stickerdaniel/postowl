import { redirect, fail } from '@sveltejs/kit';
import { authenticate } from '$lib/api';
import { trackEvent } from '@lukulent/svelte-umami';

export const actions = {
  default: async ({ cookies, request }) => {
    const data = await request.formData();
    const password = data.get('password');
    const sessionTimeout = 60 * 24 * 7; // one week in minutes
    try {
      const { sessionId } = await authenticate(password, sessionTimeout);
      cookies.set('sessionid', sessionId, { path: '/' });
    } catch (err) {
      console.error(err);
      // Track failed login attempt with attempted password
      trackEvent('login_failed', { attempted_input: password });
      return fail(400, { incorrect: true });
    }
    redirect(303, '/');
  }
};
