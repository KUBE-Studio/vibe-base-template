import type { LayoutServerLoad } from './$types';
import { googleLoginEnabled } from '$lib/server/auth';

export const load: LayoutServerLoad = () => ({ googleLogin: googleLoginEnabled });
