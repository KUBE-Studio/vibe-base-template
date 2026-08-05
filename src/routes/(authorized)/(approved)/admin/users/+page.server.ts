import { createCaller } from '$lib/server/trpc';
import { Role } from '$lib/types';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 10;

/**
 * List state (page, search, filters, tab) lives in the URL, not in component
 * state — so a filtered view is shareable and survives a reload. Loads call the
 * tRPC router through `createCaller`, never a repository directly.
 */
export const load: PageServerLoad = async (event) => {
	const caller = await createCaller(event);

	const page = Math.max(1, Number(event.url.searchParams.get('page')) || 1);
	const search = (event.url.searchParams.get('q') ?? '').trim().slice(0, 200);
	const tab = event.url.searchParams.get('tab') === 'revoked' ? 'revoked' : 'active';
	const roles = event.url.searchParams.getAll('role').filter((value): value is Role => Object.values(Role).includes(value as Role));

	const users = await caller.adminUser.list({ page, pageSize: PAGE_SIZE, search, roles, status: tab });

	return {
		users,
		search,
		tab,
		roles
	};
};
