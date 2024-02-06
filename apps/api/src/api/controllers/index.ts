import { Hono } from 'hono';
import { eventController } from './event.controller';
import { healthController } from './health.controller';
import { internalTeamController } from './internal-team.controller';
import { teamController } from './team.controller';
import { trpcController } from './trpc.controller';

export const controllers = new Hono()
	.route('/health', healthController)
	.route('/v1/event', eventController)
	.route('/trpc', trpcController)
	.route('/internal/team', internalTeamController)
	.route('/v1/team', teamController);
