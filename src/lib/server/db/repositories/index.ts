import type { DB } from '..';
import { RegistrationRepository } from './registration-repository';
import { UserRepository } from './user-repository';

/**
 * One instance per tRPC request (see `router/context.ts`). New repositories are
 * registered here and reached as `ctx.repositories.<name>` — procedures never
 * construct one themselves.
 */
export class Repositories {
	readonly registrations: RegistrationRepository;
	readonly users: UserRepository;

	constructor(db: DB) {
		this.registrations = new RegistrationRepository(db);
		this.users = new UserRepository(db);
	}
}

export interface PaginatedResult<T> {
	items: T[];
	total: number;
	page: number;
	pageSize: number;
}
