import { redirect } from '@sveltejs/kit';
import type { RequestEvent } from '@sveltejs/kit';

export async function load(event: RequestEvent) {
	const email = event.url.searchParams.get('email');

	if (!email) {
		throw redirect(303, '/auth/register');
	}

	return {
		email
	};
}
