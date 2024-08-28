import { dev } from '$app/environment';
import { trpc as t, trpcWithSession as tSession } from '@eight/shared/trpc';

export const trpcWithSession = (sessionId: string) =>
	tSession(dev ? 'http://localhost:3000' : '/api', sessionId);

export const trpc = t(dev ? 'http://localhost:3000' : '/api');
