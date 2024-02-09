import { zValidator } from '@hono/zod-validator';
import { Http } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { Hono } from 'hono';
import { z } from 'zod';
import { ManyTeamColors } from '../../colors/dtos/colors.dto';
import { eventsService } from '../../events/events.service';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';

export const eventController = new Hono().get(
	'/:event',
	zValidator('param', z.object({ event: z.string().max(64) })),
	async (context) => {
		const params = context.req.valid('param');

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
