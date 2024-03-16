import { trpcServer } from '@hono/trpc-server';
import type { Server } from 'bun';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { configService } from '../../config/config.service';
import { appRouter } from '../../trpc/app.router';
import { createContext } from '../../trpc/context';
import type { Env } from '../interfaces/env.interface';

export function createTrpcController(getServer: () => Server) {
	return new Hono<Env>()
		.use(
			'*',
			cors({
				origin: configService.websiteUrl,
			}),
		)
		.use(
			'/*',
			trpcServer({
				router: appRouter,
				createContext: (options) => createContext(getServer, options),
				onError: (options) => {
					if (options.error.code === 'INTERNAL_SERVER_ERROR') {
						// Actual server error, should throw
						throw options.error;
					}

					// Use default TRPC error response for client errors
				},
			}),
		);
}
