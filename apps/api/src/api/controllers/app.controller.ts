import type { Server } from 'bun';
import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { timing } from 'hono/timing';
import { baseLogger } from '../../logger/logger';
import { trackFn } from '../../timing/timing';
import { errorHandler } from '../error-handler';
import type { Env } from '../interfaces/env.interface';
import { healthController } from './health.controller';
import { internalController } from './internal.controller';
import { createTrpcController } from './trpc.controller';
import { v1Controller } from './v1.controller';

const logger = baseLogger.child({ module: 'server' });

export function createAppController(getServer: () => Server) {
	return (
		new Hono<Env>()
			.onError(errorHandler)
			// Wrap every route in an async_hooks store use for server timing
			.use(
				'*',
				// Actually define the env
				(context, next) => {
					context.env.server = getServer();
					return next();
				},
				trackFn,
				honoLogger((...messages) => logger.info(...messages)),
				timing({
					enabled(context) {
						// Required until https://github.com/honojs/hono/pull/2359 is merged and I can just programmatically define the cross origin policy
						// This is also hacky and I believe is causing `Timer "total" does not exist!` warnings to be printed :/
						return !context.req.path.startsWith('/v1');
					},
				}),
			)
			.route('v1', v1Controller)
			.route('health', healthController)
			.route('trpc', createTrpcController(getServer))
			.route('internal', internalController)
	);
}
