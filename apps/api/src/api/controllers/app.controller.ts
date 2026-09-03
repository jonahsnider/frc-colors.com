import { OpenAPIHono } from '@hono/zod-openapi';
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
	const app = new OpenAPIHono().onError(errorHandler);

	// Wrap every route in an async_hooks store use for server timing
	app.use(
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
	);
	app.route('v1', v1Controller);
	app.route('health', healthController);
	app.route('trpc', createTrpcController());
	app.route('internal', internalController);
	app.doc31('/openapi.json', {
		openapi: '3.1.0',
		info: {
			title: 'FRC Colors API',
			version: '1.0.0',
			description: 'Primary and secondary colors for FIRST Robotics Competition teams.',
			license: {
				name: 'MIT',
				url: 'https://github.com/jonahsnider/frc-colors.com/blob/main/LICENSE',
			},
		},
		servers: [{ url: 'https://api.frc-colors.com', description: 'Production' }],
		security: [],
		tags: [
			{ name: 'Teams', description: 'Look up colors by FRC team number.' },
			{ name: 'Events', description: 'Look up colors for teams attending an FRC event.' },
			{ name: 'Health', description: 'Check API and database availability.' },
		],
	});

	return app;
}
