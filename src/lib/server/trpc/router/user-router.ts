import { on } from 'node:events';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { trpc } from './context';
import { requireLogin } from './middlewares';

const nullableText = z
	.string()
	.trim()
	.max(200)
	.transform((value) => (value === '' ? null : value));

export const userRouter = trpc.router({
	me: requireLogin.query(async ({ ctx }) => {
		const user = await ctx.repositories.users.findById(ctx.user.id);

		if (!user) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'user not found' });
		}

		return user;
	}),
	updateProfile: requireLogin
		.input(
			z.object({
				firstName: z.string().trim().min(1).max(100),
				lastName: z.string().trim().min(1).max(100),
				companyName: nullableText
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.repositories.users.updateProfile(ctx.user.id, input);

			if (!updated) {
				throw new TRPCError({ code: 'NOT_FOUND', message: 'user not found' });
			}

			ctx.ee.emit(`user-updated:${ctx.user.id}`, updated.id);

			return updated;
		}),
	/**
	 * Reference implementation of the realtime path: mutation emits on `ctx.ee`,
	 * the subscription streams over the WebSocket server from `trpc/wss.ts`.
	 * Copy this shape for live-updating views; delete it if the app has none.
	 */
	onProfileUpdated: requireLogin.subscription(async function* ({ ctx, signal }) {
		const events = on(ctx.ee, `user-updated:${ctx.user.id}`, { signal }) as AsyncIterable<[string]>;

		for await (const [userId] of events) {
			yield userId;
		}
	}),
	deleteMe: requireLogin.mutation(async ({ ctx }) => {
		const deleted = await ctx.repositories.users.delete(ctx.user.id, ctx.user.id);

		if (!deleted) {
			throw new TRPCError({ code: 'NOT_FOUND', message: 'user not found' });
		}

		return deleted;
	})
});
