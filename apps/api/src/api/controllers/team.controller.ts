import { Http } from '@jonahsnider/util';
import { validateParams, validateQuery } from 'next-api-utils';
import { z } from 'zod';
import { storedColors } from '../../colors/stored/stored-colors.service';
import { avatarService } from '../../teams/avatar/avatar.service';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { ApiService } from '../api.service';
import { BaseHttpException } from '../exceptions/base.exception';
import { RegisterController } from '../interfaces/controller.interface';

export const teamController: RegisterController = (app) =>
	app
		.get('/v1/team/:team', async (req, res) => {
			const params = validateParams(req, z.object({ team: TeamNumber }));

			const colors = await storedColors.getTeamColors(params.team);

			if (!colors) {
				throw new BaseHttpException(
					`Team ${params.team} had no stored colors.`,
					Http.Status.NotFound,
					'E_TEAM_NOT_FOUND',
				);
			}

			res.json(ApiService.teamColorsToDto(colors));
		})
		.get('/v1/team', async (req, res) => {
			const params = validateQuery(
				{ url: new URL(req.url, 'http://localhost').toString() },
				z.object({ team: TeamNumber.or(TeamNumber.array()) }),
			);
			const teams = Array.isArray(params.team) ? params.team : [params.team];

			const colors = await storedColors.getTeamColors(teams);

			res.json(ApiService.manyTeamColorsToDto(colors));
		})
		.get('/internal/team/:team/avatar.png', async (req, res) => {
			const params = validateParams(req, z.object({ team: TeamNumber }));

			const avatar = await avatarService.getAvatar(params.team);

			if (!avatar) {
				throw new BaseHttpException(
					`Team ${params.team} had no stored avatar.`,
					Http.Status.NotFound,
					'E_TEAM_NOT_FOUND',
				);
			}

			res.setHeader('Content-Type', 'image/png');
			res.send(avatar);
		});
