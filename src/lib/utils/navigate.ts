import { resolve } from '$app/paths';
import { goto } from '$app/navigation';
import type { RouteIdWithSearchOrHash, PathnameWithSearchOrHash } from '$app/types';

export type NavigateParams = RouteIdWithSearchOrHash | PathnameWithSearchOrHash;

export function navigate<T extends NavigateParams>(...args: Parameters<typeof resolve<T>>): Promise<void> {
	return goto(resolve(...args));
}
