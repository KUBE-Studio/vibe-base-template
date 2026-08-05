import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url }) => {
	const token = url.searchParams.get('token');
	const error = url.searchParams.get('error');

	if (!token || error === 'INVALID_TOKEN') {
		throw redirect(303, '/auth/forgot-password?reason=invalid-token');
	}

	return {
		token
	};
};
