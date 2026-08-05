import { Role } from '$lib/types';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async (event) => {
	const { session, user } = event.locals;

	if (!session) {
		redirect(307, '/auth/login');
	}

	if (user?.role !== Role.ADMIN) {
		redirect(307, '/');
	}

	return { user };
};
