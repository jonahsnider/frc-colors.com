import { Hono } from 'hono';
import { internalTeamController } from './internal-team.controller.ts';

export const internalController = new Hono().route('team', internalTeamController);
