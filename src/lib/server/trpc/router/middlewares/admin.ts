import { TRPCError } from '@trpc/server';
import { trpc } from '../context';
import { Role } from '$lib/types';
import { isApprovedUser } from './login';

const isAdmin = isApprovedUser.unstable_pipe(({ ctx, next }) => {
	const { user } = ctx;

	if (user.role !== Role.ADMIN) {
		throw new TRPCError({ code: 'FORBIDDEN' });
	}

	return next({ ctx });
});

export const requireAdmin = trpc.procedure.use(isAdmin);
