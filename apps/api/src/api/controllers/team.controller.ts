import { Http } from '@jonahsnider/util';
import { Hono } from 'hono';
import { validateParams, validateQuery } from 'next-api-utils';
import { z } from 'zod';
import { storedColors } from '../../colors/stored/stored-colors.service';
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

		const colors = await storedColors.getTeamColors(params.team);

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
		const params = validateQuery({ url: context.req.url }, z.object({ team: TeamNumber.or(TeamNumber.array()) }));
		const teams = Array.isArray(params.team) ? params.team : [params.team];

		const colors = await storedColors.getTeamColors(teams);

		return context.json(ApiService.manyTeamColorsToDto(colors));
	});
