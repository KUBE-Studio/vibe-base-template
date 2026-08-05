import { TRPCError } from '@trpc/server';
import { trpc } from '../context';
import { RegistrationStatus, Role } from '$lib/types';

const isLoggedIn = trpc.middleware(async ({ ctx, next }) => {
	const { user, session } = ctx;

	if (!user || !session) {
		throw new TRPCError({ code: 'UNAUTHORIZED' });
	}

	return next({ ctx: { ...ctx, user, session } });
});

export const requireLogin = trpc.procedure.use(isLoggedIn);

export const isApprovedUser = isLoggedIn.unstable_pipe(({ ctx, next }) => {
	const { user } = ctx;

	if (user.registrationStatus !== RegistrationStatus.APPROVED && user.role !== Role.ADMIN) {
		throw new TRPCError({ code: 'FORBIDDEN' });
	}

	return next({ ctx });
});

/**
 * @public — the guard for "signed in AND approved by an admin". The template
 * itself only needs requireLogin/requireAdmin; reach for this as soon as a
 * procedure serves regular, approved users.
 */
export const requireApprovedUser = trpc.procedure.use(isApprovedUser);
