import { Server } from 'bun';
import { Hono } from 'hono';
import { logger as honoLogger } from 'hono/logger';
import { baseLogger } from '../../logger/logger';
import { trackFn } from '../../timing/timing';
import { errorHandler } from '../error-handler';
import { Env } from '../interfaces/env.interface';
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
				trackFn,
				honoLogger((...messages) => logger.info(...messages)),
			)
			.route('v1', v1Controller)
			.route('health', healthController)
			.route('trpc', createTrpcController(getServer))
			.route('internal', internalController)
	);
}
