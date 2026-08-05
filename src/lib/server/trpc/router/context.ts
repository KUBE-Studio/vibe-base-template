import superjson from 'superjson';
import { initTRPC } from '@trpc/server';
import { auth } from '$lib/server/auth';
import { db } from '$lib/server/db';
import { Repositories } from '$lib/server/db/repositories';
import { ee } from '$lib/server/trpc/ee';
import type { RequestEvent } from '@sveltejs/kit';
import type { CreateWSSContextFnOptions } from '@trpc/server/adapters/ws';

export async function createContext(event: RequestEvent) {
	const session = await auth.api.getSession({
		headers: event.request.headers
	});

	return {
		repositories: new Repositories(db),
		user: session?.user ?? null,
		session: session?.session ?? null,
		ee
	};
}

export async function createWSSContext(opts: CreateWSSContextFnOptions) {
	const headers = new Headers();
	for (const [key, value] of Object.entries(opts.req.headers)) {
		if (value !== undefined) {
			headers.set(key, Array.isArray(value) ? value.join(', ') : value);
		}
	}

	const session = await auth.api.getSession({ headers });

	return {
		repositories: new Repositories(db),
		user: session?.user ?? null,
		session: session?.session ?? null,
		ee
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;

export const trpc = initTRPC.context<Context>().create({
	transformer: superjson
});
