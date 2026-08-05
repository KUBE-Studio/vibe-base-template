import http from 'node:http';
import type { Server } from 'node:http';

// @ts-expect-error build/handler.js is produced by @sveltejs/adapter-node at build time
import { handler } from './build/handler.js';

// Importing handler.js triggers the SvelteKit server initialisation, which
// includes loading hooks.server.ts via top-level await inside handler.js.
// hooks.server.ts registers globalThis.__trpcSetupWss so we can attach the
// tRPC WebSocket server to our HTTP server below.

declare global {
	var __trpcSetupWss: ((server: Server) => void) | undefined;
}

const port = parseInt(process.env.PORT ?? '3000');
const host = process.env.HOST ?? '0.0.0.0';

const httpServer = http.createServer(handler);

if (globalThis.__trpcSetupWss) {
	globalThis.__trpcSetupWss(httpServer);
} else {
	console.error('[server] __trpcSetupWss not registered — WebSocket server will not start');
}

httpServer.listen({ port, host }, () => {
	console.log(`Listening on http://${host}:${port}`);
});

process.on('SIGTERM', () => httpServer.close());
process.on('SIGINT', () => httpServer.close());
