import { EventEmitter } from 'node:events';

/**
 * In-process pub/sub behind the tRPC subscriptions. Channels are keyed per
 * entity (`<topic>:<id>`) so a subscriber only wakes up for its own events.
 *
 * Single-process only — if the app is ever scaled to more than one node, this
 * has to move to Postgres LISTEN/NOTIFY or Redis.
 */
type EventMap = Record<`user-updated:${string}`, [string]>;

// persist on globalThis so HMR reloads don't create a fresh instance
const g = globalThis as Record<string, unknown>;

if (!g.__trpcEE) {
	g.__trpcEE = new EventEmitter<EventMap>();
}

export const ee = g.__trpcEE as EventEmitter<EventMap>;
