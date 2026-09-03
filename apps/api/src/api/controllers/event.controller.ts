import { createRoute, z } from '@hono/zod-openapi';
import { Http } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { analyticsService } from '../../analytics/analytics.service.ts';
import type { ManyTeamColors } from '../../colors/dtos/colors.dto.ts';
import { eventsService } from '../../events/events.service.ts';
import { ApiService } from '../api.service.ts';
import { BaseHttpException } from '../exceptions/base.exception.ts';
import { createOpenAPIController, ExceptionSchema, jsonResponse, ManyTeamColorsHttpSchema } from '../openapi.ts';

const getEventRoute = createRoute({
	method: 'get',
	path: '/{event}',
	operationId: 'getEventColors',
	tags: ['Events'],
	summary: 'Get colors for teams at an event',
	request: {
		params: z.object({ event: z.string().max(64).openapi({ example: '2023cc' }) }),
	},
	responses: {
		200: jsonResponse(ManyTeamColorsHttpSchema, 'Colors for the teams at the event'),
		400: jsonResponse(ExceptionSchema, 'Invalid event code'),
		404: jsonResponse(ExceptionSchema, 'Event not found'),
		500: jsonResponse(ExceptionSchema, 'Internal server error'),
	},
});

export const eventController = createOpenAPIController().openapi(getEventRoute, async (context) => {
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
			throw new BaseHttpException(`Event ${params.event} not found on TBA.`, Http.Status.NotFound, 'E_EVENT_NOT_FOUND');
		}

		throw error;
	}

	return context.json(ApiService.manyTeamColorsToDto(colors), 200);
});
