import { Http } from '@jonahsnider/util';
import { Hono } from 'hono';
import { QueryBooleanSchema, validateParams, validateQuery } from 'next-api-utils';
import { z } from 'zod';
import { colorsService } from '../../colors/colors.service';
import { ManyTeamColors } from '../../colors/dtos/colors.dto';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';

export const teamController = new Hono()
	.get('/:team', async (context) => {
		const params = validateParams(
			{ params: { team: context.req.param('team') } },
			z.object({
				team: TeamNumber,
			}),
		);

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
			z.object({ team: TeamNumber.or(TeamNumber.array()) }).or(
				z.object({
					all: QueryBooleanSchema.refine((arg) => arg, 'You may not set this to false'),
				}),
			),
		);

		let colors: ManyTeamColors;

		if ('all' in params) {
			colors = await colorsService.stored.getAllTeamColors();
		} else {
			const teams = Array.isArray(params.team) ? params.team : [params.team];

			colors = await colorsService.stored.getTeamColors(teams);
		}

		return context.json(ApiService.manyTeamColorsToDto(colors));
	});
