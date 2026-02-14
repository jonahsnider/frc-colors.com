import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { eventController } from './event.controller.ts';
import { teamController } from './team.controller.ts';

export const v1Controller = new Hono().use('*', cors()).route('/event', eventController).route('/team', teamController);
