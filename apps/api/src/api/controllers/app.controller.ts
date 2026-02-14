import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { timeout } from 'hono/timeout';
import { timing } from 'hono/timing';
import { baseLogger } from '../../logger/logger.ts';
import { trackFn } from '../../timing/timing.ts';
import { errorHandler } from '../error-handler.ts';
import { healthController } from './health.controller.ts';
import { internalController } from './internal.controller.ts';
import { createTrpcController } from './trpc.controller.ts';
import { v1Controller } from './v1.controller.ts';

const logger = baseLogger.child({ module: 'server' });

export function createAppController() {
	return (
		new Hono()
			.onError(errorHandler)
			// Wrap every route in an async_hooks store use for server timing
			.use(
				'*',
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
			.route('trpc', createTrpcController())
			.route('internal', internalController)
	);
}
