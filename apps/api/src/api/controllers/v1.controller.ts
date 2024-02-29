import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import { eventController } from './event.controller';
import { teamController } from './team.controller';
import { Env } from '../interfaces/env.interface';

export const v1Controller = new Hono<Env>()
	.use('*', cors(), timing({ crossOrigin: true }))
	.route('/event', eventController)
	.route('/team', teamController);
