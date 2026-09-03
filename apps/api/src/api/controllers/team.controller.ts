import { createRoute, z } from '@hono/zod-openapi';
import { Http } from '@jonahsnider/util';
import { QueryBooleanSchema } from 'next-api-utils';
import { analyticsService } from '../../analytics/analytics.service.ts';
import { colorsService } from '../../colors/colors.service.ts';
import type { ManyTeamColors } from '../../colors/dtos/colors.dto.ts';
import { ApiService } from '../api.service.ts';
import { BaseHttpException } from '../exceptions/base.exception.ts';
import {
	createOpenAPIController,
	ExceptionSchema,
	jsonResponse,
	ManyTeamColorsHttpSchema,
	TeamColorsHttpSchema,
	TeamNumberHttpSchema,
} from '../openapi.ts';

const getTeamRoute = createRoute({
	method: 'get',
	path: '/{team}',
	operationId: 'getTeamColors',
	tags: ['Teams'],
	summary: 'Get colors for a team',
	request: {
		params: z.object({ team: TeamNumberHttpSchema }),
	},
	responses: {
		200: jsonResponse(TeamColorsHttpSchema, 'The team colors'),
		400: jsonResponse(ExceptionSchema, 'Invalid team number'),
		404: jsonResponse(ExceptionSchema, 'No colors are stored for the team'),
		500: jsonResponse(ExceptionSchema, 'Internal server error'),
	},
});

const getTeamsRoute = createRoute({
	method: 'get',
	path: '/',
	operationId: 'getManyTeamColors',
	tags: ['Teams'],
	summary: 'Get colors for multiple teams',
	description: 'Pass one or more `team` parameters, or pass `all` to return every team.',
	request: {
		query: z
			.object({
				team: TeamNumberHttpSchema.or(TeamNumberHttpSchema.array().max(500)).optional(),
				all: QueryBooleanSchema.optional(),
			})
			.superRefine((value, context) => {
				if (value.all === false) {
					context.addIssue({ code: 'custom', message: 'You may not set all to false', path: ['all'] });
				} else if ((value.team !== undefined) === (value.all === true)) {
					context.addIssue({ code: 'custom', message: 'Pass either team or all, but not both' });
				}
			}),
	},
	responses: {
		200: jsonResponse(ManyTeamColorsHttpSchema, 'The requested team colors'),
		400: jsonResponse(ExceptionSchema, 'Invalid query parameters'),
		500: jsonResponse(ExceptionSchema, 'Internal server error'),
	},
});

export const teamController = createOpenAPIController()
	.openapi(getTeamRoute, async (context) => {
		const params = context.req.valid('param');

		const ip = ApiService.getIp(context);
		if (ip) {
			analyticsService.client.capture({
				distinctId: ip,
				event: 'api_get_team_colors',
				properties: {
					team: params.team,
				},
			});
		}

		const colors = await colorsService.stored.getTeamColors(params.team);

		if (!colors) {
			throw new BaseHttpException(
				`Team ${params.team} had no stored colors.`,
				Http.Status.NotFound,
				'E_TEAM_NOT_FOUND',
			);
		}

		return context.json(ApiService.teamColorsToDto(colors), 200);
	})
	.openapi(getTeamsRoute, async (context) => {
		const params = context.req.valid('query');

		let colors: ManyTeamColors;

		const ip = ApiService.getIp(context);

		if ('all' in params) {
			if (ip) {
				analyticsService.client.capture({
					distinctId: ip,
					event: 'api_get_all_team_colors',
				});
			}

			colors = await colorsService.stored.getAllTeamColors();
		} else {
			if (params.team === undefined) {
				throw new Error('Validated team query did not include a team number');
			}

			const teams = Array.isArray(params.team) ? params.team : [params.team];

			if (ip) {
				analyticsService.client.capture({
					distinctId: ip,
					event: 'api_get_many_team_colors',
					properties: {
						teams,
					},
				});
			}

			colors = await colorsService.stored.getTeamColors(teams);
		}

		return context.json(ApiService.manyTeamColorsToDto(colors), 200);
	});
