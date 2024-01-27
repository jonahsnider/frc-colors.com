import { Http } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { validateParams } from 'next-api-utils';
import { z } from 'zod';
import { ManyTeamColors } from '../../colors/dtos/colors.dto';
import { eventsService } from '../../events/events.service';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';
import { RegisterController } from '../interfaces/controller.interface';

export const eventController: RegisterController = (app) =>
	app.get('/v1/event/:event', async (req, res) => {
		const params = validateParams(req, z.object({ event: z.string().max(64) }));

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

		res.json(ApiService.manyTeamColorsToDto(colors));
	});
