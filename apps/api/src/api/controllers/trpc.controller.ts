import { createHTTPHandler } from '@trpc/server/adapters/standalone';
import { appRouter } from '../../trpc/app.router';
import { createContext } from '../../trpc/context';
import { RegisterController } from '../interfaces/controller.interface';

const handler = createHTTPHandler({
	router: appRouter,
	createContext,
});

export const trpcController: RegisterController = (app) => app.use('/trpc', handler).use('/trpc/*', handler);
