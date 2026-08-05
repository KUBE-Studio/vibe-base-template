import { trpc } from './context';
import { adminUserRouter } from './admin-user-router';
import { registrationRouter } from './registration-router';
import { userRouter } from './user-router';

export { createContext, createWSSContext, trpc } from './context';

/**
 * The portal API. One sub-router per domain, registered here — a procedure that
 * is not reachable from this tree does not exist for the client.
 */
export const router = trpc.router({
	user: userRouter,
	registration: registrationRouter,
	adminUser: adminUserRouter
});

export type AppRouter = typeof router;
