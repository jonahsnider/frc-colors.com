import { zValidator } from '@hono/zod-validator';
import { Http } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { Hono } from 'hono';
import { z } from 'zod';
import { analyticsService } from '../../analytics/analytics.service';
import type { ManyTeamColors } from '../../colors/dtos/colors.dto';
import { eventsService } from '../../events/events.service';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';
import type { Env } from '../interfaces/env.interface';

export const eventController = new Hono<Env>().get(
	'/:event',
	zValidator('param', z.object({ event: z.string().max(64) })),
	async (context) => {
		const params = context.req.valid('param');

		const ip = ApiService.getIp(context);
		if (ip) {
			analyticsService.client.capture({
				distinctId: ip,
				event: 'api_get_event_colors',
				properties: {
					event: params.event,
				},
			});
		}

		let colors: ManyTeamColors;

		try {
			colors = await eventsService.getColorsForEvent(params.event);
		} catch (error) {
			if (error instanceof TRPCError && error.code === 'NOT_FOUND') {
				throw new BaseHttpException(
					`Event ${params.event} not found on TBA.`,
					Http.Status.NotFound,
					'E_EVENT_NOT_FOUND',
				);
			}

			throw error;
		}

		return context.json(ApiService.manyTeamColorsToDto(colors));
	},
);
