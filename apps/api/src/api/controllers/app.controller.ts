import type { Server } from 'bun';
import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { timeout } from 'hono/timeout';
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

export function createAppController(getServer: () => Server<undefined>) {
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
				honoLogger((...params) => logger.info(params.join(' '))),
				timeout(60_000),
				timing({
					crossOrigin(context) {
						if (context.req.path.startsWith('/v1') || context.req.path.startsWith('/health')) {
							// API route, allow cross origin
							return true;
						}

						return 'https://frc-colors.com';
					},
				}),
			)
			.route('v1', v1Controller)
			.route('health', healthController)
			.route('trpc', createTrpcController(getServer))
			.route('internal', internalController)
	);
}
