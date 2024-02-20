import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HonoAdapter } from '@bull-board/hono';
import { Hono } from 'hono';
import { basicAuth } from 'hono/basic-auth';
import { serveStatic } from 'hono/bun';
import { configService } from '../../config/config.service';
import { ALL_QUEUES } from '../../queues/queues';

const BASE_PATH = '/internal/queues';

const serverAdapter = new HonoAdapter(serveStatic);

createBullBoard({
	queues: ALL_QUEUES.map((queue) => new BullMQAdapter(queue)),
	serverAdapter,
});

export const queuesController = new Hono()
	.use(
		basicAuth({
			username: configService.adminUsername,
			password: configService.adminApiToken,
		}),
	)
	.route('', serverAdapter.setBasePath(BASE_PATH).registerPlugin())
	// This is a SPA, redirect any routes that aren't matched by the server to the home page
	.get('/*', (context) => context.redirect(BASE_PATH));
