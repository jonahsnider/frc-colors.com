import { trpcServer } from '@hono/trpc-server';
import { TRPCError } from '@trpc/server';
import type { Server } from 'bun';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { configService } from '../../config/config.service';
import { appRouter } from '../../trpc/app.router';
import { createContext } from '../../trpc/context';
import type { Env } from '../interfaces/env.interface';

export function createTrpcController(getServer: () => Server) {
	return new Hono<Env>().use(
		'/*',
		cors({
			origin: configService.websiteUrl,
		}),
		trpcServer({
			// @ts-expect-error @hono/trpc-server has not been updated for tRPC 11
			router: appRouter,
			// @ts-expect-error @hono/trpc-server has not been updated for tRPC 11
			createContext: (options) => createContext(getServer, options),
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
