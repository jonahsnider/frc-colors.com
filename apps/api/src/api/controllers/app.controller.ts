import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { configService } from '../../config/config.service';
import { baseLogger } from '../../logger/logger';
import { errorHandler } from '../error-handler';
import { eventController } from './event.controller';
import { healthController } from './health.controller';
import { internalTeamController } from './internal-team.controller';
import { teamController } from './team.controller';
import { trpcController } from './trpc.controller';

const logger = baseLogger.child({ module: 'server' });

export const appController = new Hono()
	.onError(errorHandler)
	.use(
		'*',
		honoLogger((...messages) => logger.info(...messages)),
	)
	.use('/v1/*', cors())
	.use(
		'/internal/*',
		cors({
			origin: configService.websiteUrl,
		}),
	)
	.use(
		'/trpc/*',
		cors({
			origin: configService.websiteUrl,
		}),
	)
	.route('/health', healthController)
	.route('/v1/event', eventController)
	.route('/trpc', trpcController)
	.route('/internal/team', internalTeamController)
	.route('/v1/team', teamController);
