import type { RequestEvent } from '@sveltejs/kit';
import { createContext, router, trpc } from './router';

export async function createCaller(event: RequestEvent) {
	const ctx = await createContext(event);
	const createCaller = trpc.createCallerFactory(router);

	return createCaller(ctx);
}
