import { trpcServer } from '@hono/trpc-server';
import { TRPCError } from '@trpc/server';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { configService } from '../../config/config.service.ts';
import { appRouter } from '../../trpc/app.router.ts';
import { createContext } from '../../trpc/context.ts';

export function createTrpcController() {
	return new Hono().use(
		'/*',
		cors({
			origin: configService.websiteUrl,
		}),
		trpcServer({
			router: appRouter,
			createContext: (options, c) => createContext(c, options),
			onError: (options) => {
				if (options.error instanceof TRPCError) {
					if (options.error.code === 'INTERNAL_SERVER_ERROR') {
						// Actual server error, should throw
						throw options.error;
					}
				} else {
					// Some other kind of error, should throw
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'An internal server error occurred',
						cause: options.error,
					});
				}

				// Use default TRPC error response for client errors
			},
		}),
	);
}
