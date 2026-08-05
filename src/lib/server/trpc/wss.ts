import { applyWSSHandler } from '@trpc/server/adapters/ws';
import { WebSocketServer } from 'ws';
import type { Server, IncomingMessage } from 'node:http';
import type { Duplex } from 'node:stream';
import { createWSSContext, router } from './router';

export function setupWss(server: Server): () => void {
	const wss = new WebSocketServer({ noServer: true });

	const onUpgrade = (req: IncomingMessage, socket: Duplex, head: Buffer) => {
		const { pathname } = new URL(req.url ?? '/', 'http://localhost');
		if (pathname !== '/trpc-ws') return;
		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit('connection', ws, req);
		});
	};

	server.on('upgrade', onUpgrade);

	const handler = applyWSSHandler({
		wss,
		router,
		createContext: createWSSContext,
		keepAlive: {
			enabled: true,
			pingMs: 30000,
			pongWaitMs: 5000
		}
	});

	const onClose = () => {
		handler.broadcastReconnectNotification();
		wss.close();
	};

	server.on('close', onClose);

	return () => {
		server.off('upgrade', onUpgrade);
		server.off('close', onClose);
		handler.broadcastReconnectNotification();
		wss.close();
	};
}
