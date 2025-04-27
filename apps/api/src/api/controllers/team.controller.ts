import { Http } from '@jonahsnider/util';
import { Hono } from 'hono';
import { QueryBooleanSchema, validateParams, validateQuery } from 'next-api-utils';
import { z } from 'zod';
import { analyticsService } from '../../analytics/analytics.service';
import { colorsService } from '../../colors/colors.service';
import type { ManyTeamColors } from '../../colors/dtos/colors.dto';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';
import type { Env } from '../interfaces/env.interface';

export const teamController = new Hono<Env>()
	.get('/:team', async (context) => {
		const params = await validateParams(
			{ params: Promise.resolve({ team: context.req.param('team') }) },
			z.object({
				team: TeamNumber,
			}),
		);

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

		return context.json(ApiService.teamColorsToDto(colors));
	})
	.get('/', async (context) => {
		const params = validateQuery(
			{ url: context.req.url },
			z.object({ team: TeamNumber.or(TeamNumber.array().max(500)) }).or(
				z.object({
					all: QueryBooleanSchema.refine((arg) => arg, 'You may not set this to false'),
				}),
			),
		);

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

		return context.json(ApiService.manyTeamColorsToDto(colors));
	});
