import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import type { Plugin } from 'vite';

function wssPlugin(): Plugin {
	return {
		name: 'trpc-wss',
		configureServer(server) {
			const httpServer = server.httpServer;
			if (!httpServer) return;

			let cleanupWss: (() => void) | undefined;

			const init = async () => {
				cleanupWss?.();
				cleanupWss = undefined;
				const { setupWss } = await server.ssrLoadModule('/src/lib/server/trpc/wss.ts');
				cleanupWss = setupWss(httpServer);
			};

			// Re-init the WSS whenever trpc source files change so applyWSSHandler
			// always receives the current router (not a stale pre-HMR instance).
			server.watcher.on('change', (file) => {
				if (file.includes('/src/lib/server/trpc/')) {
					init().catch(console.error);
				}
			});

			if (httpServer.listening) {
				init().catch(console.error);
			} else {
				httpServer.once('listening', () => init().catch(console.error));
			}
		}
	};
}

export default defineConfig({
	plugins: [tailwindcss(), sveltekit(), wssPlugin()]
});
