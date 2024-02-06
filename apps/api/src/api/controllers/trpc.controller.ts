import { trpcServer } from '@hono/trpc-server';
import { Hono } from 'hono';
import { appRouter } from '../../trpc/app.router';
import { createContext } from '../../trpc/context';

export const trpcController = new Hono();

trpcController.use(
	'/*',
	trpcServer({
		router: appRouter,
		createContext,
		onError: (options) => {
			if (options.error.code === 'INTERNAL_SERVER_ERROR') {
				// Actual server error, should throw
				throw options.error;
			}

			// Use default TRPC error response for client errors
		},
	}),
);
