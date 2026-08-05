import { and, desc, eq, isNull, sql } from 'drizzle-orm';
import type { DB } from '..';
import { user } from '../schema';
import { RegistrationStatus, Role } from '$lib/types';
import type { User } from './user-repository';
import type { PaginatedResult } from '.';

export interface ListRegistrationApplicationsOptions {
	page: number;
	pageSize: number;
}

export interface CompleteProfileData {
	companyName: string | null;
}

export type RegistrationApplicationView = Pick<
	User,
	'id' | 'name' | 'email' | 'companyName' | 'applicationSubmittedAt' | 'firstName' | 'lastName' | 'role'
>;

/**
 * The approval workflow: REGISTERED → (completeProfile) → PENDING →
 * (approve/decline) → APPROVED/DECLINED. Every transition is guarded by the
 * expected source status in the WHERE clause, so a double-click or a stale tab
 * cannot approve an already-declined user.
 */
export class RegistrationRepository {
	constructor(private readonly db: DB) {}

	async completeProfile(userId: string, data: CompleteProfileData): Promise<{ id: string } | undefined> {
		const [updated] = await this.db
			.update(user)
			.set({
				companyName: data.companyName,
				registrationStatus: RegistrationStatus.PENDING,
				applicationSubmittedAt: new Date()
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.REGISTERED)))
			.returning({ id: user.id });

		return updated;
	}

	async findPendingApplications({
		page,
		pageSize
	}: ListRegistrationApplicationsOptions): Promise<PaginatedResult<RegistrationApplicationView>> {
		const offset = (page - 1) * pageSize;

		const [items, [{ total }]] = await Promise.all([
			this.db.query.user.findMany({
				where: eq(user.registrationStatus, RegistrationStatus.PENDING),
				orderBy: desc(user.applicationSubmittedAt),
				limit: pageSize,
				offset,
				columns: {
					id: true,
					name: true,
					email: true,
					companyName: true,
					applicationSubmittedAt: true,
					firstName: true,
					lastName: true,
					role: true
				}
			}),
			this.db
				.select({ total: sql<number>`count(*)::int` })
				.from(user)
				.where(eq(user.registrationStatus, RegistrationStatus.PENDING))
		]);

		return { items, total, page, pageSize };
	}

	async approveApplication(userId: string, adminId: string, role: Role): Promise<User> {
		const [updated] = await this.db
			.update(user)
			.set({
				role,
				registrationStatus: RegistrationStatus.APPROVED,
				approvedAt: new Date(),
				approvedBy: adminId,
				declinedAt: null,
				declinedBy: null
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.PENDING)))
			.returning();

		return updated;
	}

	/** Second chance for someone who was declined before ever being approved. */
	async approveDeclinedApplication(userId: string, adminId: string, role: Role): Promise<User> {
		const [updated] = await this.db
			.update(user)
			.set({
				role,
				registrationStatus: RegistrationStatus.APPROVED,
				approvedAt: new Date(),
				approvedBy: adminId,
				declinedAt: null,
				declinedBy: null
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.DECLINED), isNull(user.approvedAt)))
			.returning();

		return updated;
	}

	async declineApplication(userId: string, adminId: string): Promise<User> {
		const [updated] = await this.db
			.update(user)
			.set({
				registrationStatus: RegistrationStatus.DECLINED,
				declinedAt: new Date(),
				declinedBy: adminId
			})
			.where(and(eq(user.id, userId), eq(user.registrationStatus, RegistrationStatus.PENDING)))
			.returning();

		return updated;
	}

	async findDeclinedApplications({
		page,
		pageSize
	}: ListRegistrationApplicationsOptions): Promise<PaginatedResult<RegistrationApplicationView & { declinedAt: Date | null }>> {
		const offset = (page - 1) * pageSize;
		const whereClause = and(eq(user.registrationStatus, RegistrationStatus.DECLINED), isNull(user.approvedAt));

		const [items, [{ total }]] = await Promise.all([
			this.db.query.user.findMany({
				where: whereClause,
				orderBy: desc(user.declinedAt),
				limit: pageSize,
				offset,
				columns: {
					id: true,
					name: true,
					email: true,
					companyName: true,
					applicationSubmittedAt: true,
					declinedAt: true,
					firstName: true,
					lastName: true,
					role: true
				}
			}),
			this.db
				.select({ total: sql<number>`count(*)::int` })
				.from(user)
				.where(whereClause)
		]);

		return { items, total, page, pageSize };
	}
}
