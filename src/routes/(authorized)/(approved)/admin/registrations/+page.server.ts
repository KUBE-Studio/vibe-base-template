import { createCaller } from '$lib/server/trpc';
import type { PageServerLoad } from './$types';

const PAGE_SIZE = 10;

export const load: PageServerLoad = async (event) => {
	const caller = await createCaller(event);

	const page = Math.max(1, Number(event.url.searchParams.get('page')) || 1);
	const tab = event.url.searchParams.get('tab') === 'declined' ? 'declined' : 'pending';

	const registrations =
		tab === 'declined'
			? await caller.registration.listDeclined({ page, pageSize: PAGE_SIZE })
			: await caller.registration.listPending({ page, pageSize: PAGE_SIZE });

	return {
		registrations,
		tab
	};
};
