import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createCaller } from '$lib/server/trpc';
import { RegistrationStatus, Role } from '$lib/types';

/**
 * The single gate in front of every authenticated route. Route groups carry the
 * access level: `(authorized)` = signed in, `(authorized)/(approved)` = cleared
 * by an admin. Never re-check this per page — put the page in the right group.
 */
export const load: LayoutServerLoad = async (event) => {
	const { session, user } = event.locals;

	if (!session || !user) {
		redirect(307, '/auth/login');
	}

	const pathname = event.url.pathname;
	const isRegistrationRoute = pathname.startsWith('/registration');
	const canUseApp = user.registrationStatus === RegistrationStatus.APPROVED || user.role === Role.ADMIN;

	if (!canUseApp) {
		if (user.registrationStatus === RegistrationStatus.REGISTERED && pathname !== '/registration/profile') {
			redirect(307, '/registration/profile');
		}

		if (user.registrationStatus === RegistrationStatus.PENDING && pathname !== '/registration/pending') {
			redirect(307, '/registration/pending');
		}

		if (user.registrationStatus === RegistrationStatus.DECLINED && pathname !== '/registration/declined') {
			redirect(307, '/registration/declined');
		}
	}

	if (canUseApp && isRegistrationRoute) {
		redirect(307, '/');
	}

	const caller = await createCaller(event);

	return {
		user: await caller.user.me()
	};
};
