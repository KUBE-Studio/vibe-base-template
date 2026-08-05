import type { Handle, ServerInit } from '@sveltejs/kit';
import { building, dev } from '$app/environment';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { user } from '$lib/server/db/schema';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { router } from '$lib/server/trpc';
import { createContext, createTRPCHandle } from '$lib/server/trpc';
import { sequence } from '@sveltejs/kit/hooks';
import { setupWss } from '$lib/server/trpc/wss';
import type { Server } from 'node:http';
import { and, eq, isNull } from 'drizzle-orm';

declare global {
	var __trpcSetupWss: ((server: Server) => void) | undefined;
}

export const init: ServerInit = async () => {
	await migrate(db, { migrationsFolder: dev ? 'src/lib/server/db/migrations' : 'migrations' });

	globalThis.__trpcSetupWss = setupWss;
};

const authHandle: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		const activeUser = await db.query.user.findFirst({
			where: and(eq(user.id, session.user.id), isNull(user.deletedAt)),
			columns: { id: true }
		});

		if (activeUser) {
			event.locals.session = session.session;
			event.locals.user = session.user;
		}
	}

	return await svelteKitHandler({ event, resolve, auth, building });
};

const trpcHandle: Handle = createTRPCHandle({ router, createContext });

export const handle = sequence(authHandle, trpcHandle);
