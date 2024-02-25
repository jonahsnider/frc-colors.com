import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { timing } from 'hono/timing';
import { eventController } from './event.controller';
import { teamController } from './team.controller';

export const v1Controller = new Hono()
	.use('*', cors(), timing({ crossOrigin: true }))
	.route('/event', eventController)
	.route('/team', teamController);
