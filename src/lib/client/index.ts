import superjson from 'superjson';
import { createAuthClient } from 'better-auth/svelte';
import { inferAdditionalFields } from 'better-auth/client/plugins';
import { createTRPCClient, createWSClient, httpBatchLink, httpLink, isNonJsonSerializable, splitLink, wsLink } from '@trpc/client';
import type { AppRouter } from '$lib/server/trpc/router';
import type { auth } from '$lib/server/auth';

const url = '/api/trpc';

const wsClient = createWSClient({
	url: () => {
		const proto = window.location.protocol === 'https:' ? 'wss' : 'ws';

		return `${proto}://${window.location.host}/trpc-ws`;
	},
	retryDelayMs: () => 1000
});

export const client = {
	auth: createAuthClient({
		plugins: [inferAdditionalFields<typeof auth>()]
	}),
	api: createTRPCClient<AppRouter>({
		links: [
			splitLink({
				condition: (op) => op.type === 'subscription',
				true: wsLink({ client: wsClient, transformer: superjson }),
				false: splitLink({
					condition: (op) => isNonJsonSerializable(op.input),
					true: httpLink({
						url,
						transformer: {
							serialize: (data) => data,
							deserialize: superjson.deserialize
						}
					}),
					false: httpBatchLink({ url, transformer: superjson })
				})
			})
		]
	})
};
