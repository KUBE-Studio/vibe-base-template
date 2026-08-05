import { and, count, desc, eq, ilike, inArray, isNotNull, isNull, or, type SQL } from 'drizzle-orm';
import { hashPassword } from 'better-auth/crypto';
import type { DB } from '..';
import { account, session as userSession, user } from '../schema';
import { RegistrationStatus, Role } from '$lib/types';

export type UserListStatus = 'active' | 'revoked';

export interface ListAdminUsersOptions {
	page: number;
	pageSize: number;
	search: string;
	roles: Role[];
	status: UserListStatus;
}

export interface UpdateProfileData {
	firstName: string;
	lastName: string;
	companyName: string | null;
}

export interface RestoreDeletedData {
	firstName: string;
	lastName: string;
	password: string;
}

export type User = typeof user.$inferSelect;

/** @public — shape of a row in the admin user list. */
export type UserView = Awaited<ReturnType<UserRepository['findAll']>>['items'][number];

export type MinimalUser = Pick<User, 'id' | 'name' | 'firstName' | 'lastName' | 'role'>;

/**
 * All database access goes through a repository — tRPC procedures never touch
 * `db` directly. Keeps queries testable and stops the same filter logic being
 * re-implemented per route.
 */
export class UserRepository {
	constructor(private readonly db: DB) {}

	async findById(userId: string) {
		return this.db.query.user.findFirst({
			where: and(eq(user.id, userId), isNull(user.deletedAt))
		});
	}

	async findEmailVerificationState(email: string) {
		return this.db.query.user.findFirst({
			where: eq(user.email, email),
			columns: {
				id: true,
				email: true,
				emailVerified: true,
				deletedAt: true
			}
		});
	}

	/**
	 * Signing up again with the e-mail of a soft-deleted account revives that
	 * row instead of colliding with the unique e-mail index. The account starts
	 * over at REGISTERED and has to pass approval again.
	 */
	async restoreDeletedByEmail(email: string, data: RestoreDeletedData) {
		const existingUser = await this.findEmailVerificationState(email);

		if (!existingUser?.deletedAt) {
			return null;
		}

		const hashedPassword = await hashPassword(data.password);
		const [updated] = await this.db
			.update(user)
			.set({
				role: Role.USER,
				registrationStatus: RegistrationStatus.REGISTERED,
				firstName: data.firstName,
				lastName: data.lastName,
				emailVerified: false,
				companyName: null,
				applicationSubmittedAt: null,
				approvedAt: null,
				approvedBy: null,
				declinedAt: null,
				declinedBy: null,
				deletedAt: null,
				deletedBy: null
			})
			.where(and(eq(user.id, existingUser.id), isNotNull(user.deletedAt)))
			.returning();

		if (!updated) {
			return updated;
		}

		const credentialAccount = await this.db.query.account.findFirst({
			where: and(eq(account.userId, updated.id), eq(account.providerId, 'credential')),
			columns: { id: true }
		});

		if (credentialAccount) {
			await this.db.update(account).set({ password: hashedPassword }).where(eq(account.id, credentialAccount.id));
		} else {
			await this.db.insert(account).values({
				userId: updated.id,
				accountId: updated.id,
				providerId: 'credential',
				password: hashedPassword
			});
		}

		return updated;
	}

	async findAll({ page, pageSize, search, roles, status }: ListAdminUsersOptions) {
		const offset = (page - 1) * pageSize;
		const query = this.buildUserQuery({ search, roles, status });

		const [items, [{ total }]] = await Promise.all([
			this.db.query.user.findMany({
				where: query,
				orderBy: desc(user.createdAt),
				limit: pageSize,
				offset,
				columns: {
					id: true,
					name: true,
					email: true,
					role: true,
					registrationStatus: true,
					companyName: true,
					createdAt: true,
					approvedAt: true,
					firstName: true,
					lastName: true
				}
			}),
			this.db.select({ total: count() }).from(user).where(query)
		]);

		return { items, total, page, pageSize };
	}

	async updateRole(userId: string, role: Role) {
		const [updated] = await this.db
			.update(user)
			.set({ role })
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.APPROVED)))
			.returning();

		return updated;
	}

	async updateProfile(userId: string, data: UpdateProfileData) {
		const [updated] = await this.db
			.update(user)
			.set(data)
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
			.returning();

		return updated;
	}

	async revokeAccess(userId: string, adminId: string) {
		const [updated] = await this.db
			.update(user)
			.set({
				role: Role.USER,
				registrationStatus: RegistrationStatus.DECLINED,
				declinedAt: new Date(),
				declinedBy: adminId
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.APPROVED)))
			.returning();

		if (!updated) {
			return updated;
		}

		await this.db.delete(userSession).where(eq(userSession.userId, userId));

		return updated;
	}

	async restoreAccess(userId: string) {
		const [updated] = await this.db
			.update(user)
			.set({
				registrationStatus: RegistrationStatus.APPROVED,
				declinedAt: null,
				declinedBy: null
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.DECLINED), isNotNull(user.approvedAt)))
			.returning();

		return updated;
	}

	/** Soft delete: the row survives, the sessions do not. */
	async delete(userId: string, deletedBy: string) {
		const [deleted] = await this.db
			.update(user)
			.set({ deletedAt: new Date(), deletedBy })
			.where(and(eq(user.id, userId), isNull(user.deletedAt)))
			.returning({ id: user.id });

		if (!deleted) {
			return deleted;
		}

		await this.db.delete(userSession).where(eq(userSession.userId, userId));

		return deleted;
	}

	async listApprovedAdminEmails() {
		const rows = await this.db.query.user.findMany({
			where: and(eq(user.registrationStatus, RegistrationStatus.APPROVED), eq(user.role, Role.ADMIN)),
			columns: { email: true }
		});

		return rows.map((row) => row.email);
	}

	private buildUserQuery({ search, roles, status }: { search: string; roles: Role[]; status: UserListStatus }): SQL {
		const conditions: SQL[] =
			status === 'revoked'
				? [eq(user.registrationStatus, RegistrationStatus.DECLINED), isNotNull(user.approvedAt), isNull(user.deletedAt)]
				: [eq(user.registrationStatus, RegistrationStatus.APPROVED), isNull(user.deletedAt)];

		if (roles.length > 0) {
			conditions.push(inArray(user.role, roles));
		}

		if (search) {
			const searchCondition = or(ilike(user.name, `%${search}%`), ilike(user.email, `%${search}%`));

			if (searchCondition) {
				conditions.push(searchCondition);
			}
		}

		return and(...conditions) as SQL;
	}
}
