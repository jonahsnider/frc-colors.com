import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from '../../trpc/app.router';
import { createContext } from '../../trpc/context';
import { RegisterController } from '../interfaces/controller.interface';

const handler = createHTTPHandler({
	router: appRouter,
	createContext,
	onError: (options) => {
		if (options.error.code === 'INTERNAL_SERVER_ERROR') {
			// Actual server error, should throw
			throw options.error;
		}

		// Use default TRPC error response for client errors
		return;
	},
});

export const trpcController: RegisterController = (app) => app.use('/trpc', handler).use('/trpc/*', handler);
