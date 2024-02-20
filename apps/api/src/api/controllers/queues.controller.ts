import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HonoAdapter } from '@bull-board/hono';
import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { ALL_QUEUES } from '../../queues/queues';

const serverAdapter = new HonoAdapter(serveStatic);

createBullBoard({
	queues: ALL_QUEUES.map((queue) => new BullMQAdapter(queue)),
	serverAdapter,
});

serverAdapter.setBasePath('/internal/queues');

export const queuesController = new Hono().route('/', serverAdapter.registerPlugin());
