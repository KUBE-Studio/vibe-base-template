export type { User, MinimalUser } from '$lib/server/db/repositories/user-repository';

/**
 * Access levels. `requireAdmin` in the tRPC middlewares keys off ADMIN — add
 * further roles here and pipe a matching middleware next to it, don't scatter
 * role checks through procedures.
 */
export enum Role {
	ADMIN = 'admin',
	USER = 'user'
}

/**
 * Lifecycle of an account: a user signs up (REGISTERED), completes their
 * profile (PENDING), and an admin approves or declines them. Only APPROVED
 * users (and admins) reach the app itself — enforced in
 * `(authorized)/+layout.server.ts` and `requireApprovedUser`.
 */
export enum RegistrationStatus {
	REGISTERED = 'registered',
	PENDING = 'pending',
	APPROVED = 'approved',
	DECLINED = 'declined'
}
