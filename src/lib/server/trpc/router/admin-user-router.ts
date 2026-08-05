import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { trpc } from './context';
import { requireAdmin } from './middlewares';
import { Role } from '$lib/types';

const listUsersInput = z.object({
	page: z.number().int().positive().default(1),
	pageSize: z.number().int().min(1).default(10),
	search: z.string().trim().max(200).default(''),
	roles: z.array(z.enum(Role)).default([]),
	status: z.enum(['active', 'revoked']).default('active')
});

const userIdInput = z.object({
	userId: z.uuid()
});

/** An admin must not be able to lock themselves out of their own instance. */
const assertNotCurrentUser = (targetUserId: string, currentUserId: string) => {
	if (targetUserId === currentUserId) {
		throw new TRPCError({ code: 'FORBIDDEN', message: 'you cannot manage your own access' });
	}
};

export const adminUserRouter = trpc.router({
	list: requireAdmin.input(listUsersInput).query(({ ctx, input }) => {
		return ctx.repositories.users.findAll(input);
	}),
	changeRole: requireAdmin
		.input(
			userIdInput.extend({
				role: z.enum(Role)
			})
		)
		.mutation(async ({ ctx, input }) => {
			assertNotCurrentUser(input.userId, ctx.user.id);

			const updated = await ctx.repositories.users.updateRole(input.userId, input.role);

			if (!updated) {
				throw new TRPCError({ code: 'CONFLICT', message: 'user is no longer active' });
			}

			return updated;
		}),
	revokeAccess: requireAdmin.input(userIdInput).mutation(async ({ ctx, input }) => {
		assertNotCurrentUser(input.userId, ctx.user.id);

		const updated = await ctx.repositories.users.revokeAccess(input.userId, ctx.user.id);

		if (!updated) {
			throw new TRPCError({ code: 'CONFLICT', message: 'user is no longer active' });
		}

		return updated;
	}),
	restoreAccess: requireAdmin.input(userIdInput).mutation(async ({ ctx, input }) => {
		assertNotCurrentUser(input.userId, ctx.user.id);

		const updated = await ctx.repositories.users.restoreAccess(input.userId);

		if (!updated) {
			throw new TRPCError({ code: 'CONFLICT', message: 'user access cannot be restored' });
		}

		return updated;
	}),
	delete: requireAdmin.input(userIdInput).mutation(async ({ ctx, input }) => {
		assertNotCurrentUser(input.userId, ctx.user.id);

		const deleted = await ctx.repositories.users.delete(input.userId, ctx.user.id);

		if (!deleted) {
			throw new TRPCError({ code: 'CONFLICT', message: 'user is no longer active' });
		}

		return deleted;
	})
});
