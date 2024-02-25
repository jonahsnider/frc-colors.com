import { Hono } from 'hono';
import { internalTeamController } from './internal-team.controller';
import { queuesController } from './queues.controller';

export const internalController = new Hono().route('team', internalTeamController).route('queues', queuesController);
