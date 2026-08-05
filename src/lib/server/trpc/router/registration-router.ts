import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { trpc } from './context';
import { requireAdmin, requireLogin } from './middlewares';
import { Role } from '$lib/types';
import { buildRegistrationApprovedEmail, buildRegistrationDeclinedEmail, emailService } from '$lib/server/services';
import { env } from '$env/dynamic/private';

export const registrationRouter = trpc.router({
	/**
	 * Public on purpose: called during sign-up, before a session exists. Both
	 * procedures answer identically for unknown e-mails so they cannot be used
	 * to enumerate accounts.
	 */
	restoreDeleted: trpc.procedure
		.input(
			z.object({
				firstName: z.string().trim().min(1).max(100),
				lastName: z.string().trim().min(1).max(100),
				email: z.email().toLowerCase(),
				password: z.string().min(8)
			})
		)
		.mutation(({ ctx, input }) => {
			return ctx.repositories.users.restoreDeletedByEmail(input.email, input);
		}),
	resendVerificationForExistingEmail: trpc.procedure
		.input(
			z.object({
				email: z.email().toLowerCase()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const existingUser = await ctx.repositories.users.findEmailVerificationState(input.email);

			if (!existingUser || existingUser.emailVerified) {
				return { sent: false };
			}

			return { sent: true };
		}),
	completeProfile: requireLogin
		.input(
			z.object({
				companyName: z
					.string()
					.trim()
					.max(200)
					.transform((value) => (value === '' ? null : value))
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.repositories.registrations.completeProfile(ctx.user.id, input);

			if (!updated) {
				throw new TRPCError({ code: 'CONFLICT', message: 'registration profile cannot be completed in current status' });
			}

			return updated;
		}),
	listPending: requireAdmin
		.input(
			z.object({
				page: z.number().int().positive().default(1),
				pageSize: z.number().int().min(1).default(10)
			})
		)
		.query(({ ctx, input }) => {
			return ctx.repositories.registrations.findPendingApplications(input);
		}),
	listDeclined: requireAdmin
		.input(
			z.object({
				page: z.number().int().positive().default(1),
				pageSize: z.number().int().min(1).default(10)
			})
		)
		.query(({ ctx, input }) => {
			return ctx.repositories.registrations.findDeclinedApplications(input);
		}),
	approve: requireAdmin
		.input(
			z.object({
				userId: z.uuid(),
				role: z.enum(Role)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.repositories.registrations.approveApplication(input.userId, ctx.user.id, input.role);

			if (!updated) {
				throw new TRPCError({ code: 'CONFLICT', message: 'registration application is no longer pending' });
			}

			const template = buildRegistrationApprovedEmail({
				userName: updated.name || updated.email,
				loginUrl: `${env.ORIGIN}/auth/login`
			});

			await emailService.sendEmail({ to: [updated.email], ...template });

			return updated;
		}),
	approveDeclined: requireAdmin
		.input(
			z.object({
				userId: z.uuid(),
				role: z.enum(Role)
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.repositories.registrations.approveDeclinedApplication(input.userId, ctx.user.id, input.role);

			if (!updated) {
				throw new TRPCError({ code: 'CONFLICT', message: 'registration is no longer in declined state' });
			}

			const template = buildRegistrationApprovedEmail({
				userName: updated.name || updated.email,
				loginUrl: `${env.ORIGIN}/auth/login`
			});

			await emailService.sendEmail({ to: [updated.email], ...template });

			return updated;
		}),
	decline: requireAdmin
		.input(
			z.object({
				userId: z.uuid()
			})
		)
		.mutation(async ({ ctx, input }) => {
			const updated = await ctx.repositories.registrations.declineApplication(input.userId, ctx.user.id);

			if (!updated) {
				throw new TRPCError({ code: 'CONFLICT', message: 'registration application is no longer pending' });
			}

			const template = buildRegistrationDeclinedEmail({ userName: updated.name || updated.email });

			await emailService.sendEmail({ to: [updated.email], ...template });

			return updated;
		})
});
