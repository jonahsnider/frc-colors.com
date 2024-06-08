import { Hono } from 'hono';
import { cors } from 'hono/cors';
import type { Env } from '../interfaces/env.interface';
import { eventController } from './event.controller';
import { teamController } from './team.controller';

export const v1Controller = new Hono<Env>()
	.use('*', cors())
	.route('/event', eventController)
	.route('/team', teamController);
