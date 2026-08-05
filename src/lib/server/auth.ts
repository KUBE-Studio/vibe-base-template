import { betterAuth } from 'better-auth/minimal';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { sveltekitCookies } from 'better-auth/svelte-kit';
import { env } from '$env/dynamic/private';
import { getRequestEvent } from '$app/server';
import { db } from '$lib/server/db';
import { RegistrationStatus, Role } from '$lib/types';
import { buildResetPasswordEmail, buildVerificationEmail, emailService } from '$lib/server/services';

const getProfileNames = (profile: { given_name?: string; family_name?: string; name?: string; email?: string }) => {
	const fullNameParts = profile.name?.trim().split(/\s+/) ?? [];
	const firstName = profile.given_name?.trim() || fullNameParts[0] || profile.email?.split('@')[0] || '';
	const lastName = profile.family_name?.trim() || fullNameParts.slice(1).join(' ');

	return { firstName, lastName };
};

/**
 * better-auth owns the user/session/account/verification tables (see
 * `db/schema.ts`). `additionalFields` must mirror the extra columns there —
 * fields missing from this list are dropped from the session user, which then
 * silently breaks the role and approval checks.
 *
 * `input: false` means the client cannot set the field at sign-up. Never make
 * `role` or `registrationStatus` client-writable.
 */
export const auth = betterAuth({
	baseURL: env.ORIGIN!,
	secret: env.AUTH_SECRET!,
	database: drizzleAdapter(db, {
		provider: 'pg'
	}),
	databaseHooks: {
		user: {
			create: {
				// `name` is a generated column (first + last name) — better-auth
				// must not write it directly.
				async before(user) {
					return { data: { ...user, name: undefined } };
				}
			}
		}
	},
	user: {
		additionalFields: {
			role: {
				type: Object.values(Role) as [Role, ...Role[]],
				required: true,
				defaultValue: Role.USER,
				input: false
			},
			registrationStatus: {
				type: Object.values(RegistrationStatus) as [RegistrationStatus, ...RegistrationStatus[]],
				required: true,
				defaultValue: RegistrationStatus.REGISTERED,
				input: false
			},
			firstName: {
				type: 'string',
				required: true,
				input: true
			},
			lastName: {
				type: 'string',
				required: true,
				input: true
			}
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: true,
		sendResetPassword: async ({ user, url }) => {
			const template = buildResetPasswordEmail(url);

			await emailService.sendEmail({
				to: [user.email],
				subject: template.subject,
				content: template.content
			});
		}
	},
	emailVerification: {
		sendOnSignUp: true,
		sendOnSignIn: true,
		autoSignInAfterVerification: true,
		sendVerificationEmail: async ({ user, url }) => {
			const template = buildVerificationEmail(url);

			await emailService.sendEmail({
				to: [user.email],
				subject: template.subject,
				content: template.content
			});
		}
	},
	socialProviders: {
		google: {
			clientId: env.GOOGLE_CLIENT_ID!,
			clientSecret: env.GOOGLE_CLIENT_SECRET!,
			mapProfileToUser: (profile) => getProfileNames(profile)
		}
	},
	advanced: {
		database: {
			generateId: 'uuid'
		}
	},
	plugins: [
		sveltekitCookies(getRequestEvent) // make sure this is the last plugin in the array
	]
});
