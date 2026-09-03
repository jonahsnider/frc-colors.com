import { cors } from 'hono/cors';
import { createOpenAPIController } from '../openapi.ts';
import { eventController } from './event.controller.ts';
import { teamController } from './team.controller.ts';

export const v1Controller = createOpenAPIController()
	.use('*', cors())
	.route('/event', eventController)
	.route('/team', teamController);
