import { initTRPC, TRPCError } from '@trpc/server';
import type { Context } from './context';
import { transformer } from './transformer';

/**
 * Initialization of tRPC backend
 * Should be done only once per backend!
 */
const t = initTRPC.context<Context>().create({
	transformer,
});

/**
 * Export reusable router and procedure helpers
 * that can be used throughout the router
 */
export const router = t.router;
export const publicProcedure = t.procedure;

export const adminProcedure = t.procedure.use((options) => {
	if (!options.ctx.isAdmin) {
		throw new TRPCError({
			code: 'UNAUTHORIZED',
			message: 'Missing API token',
		});
	}

	return options.next({
		ctx: {
			...options.ctx,
			isAdmin: options.ctx.isAdmin,
		},
	});
});
