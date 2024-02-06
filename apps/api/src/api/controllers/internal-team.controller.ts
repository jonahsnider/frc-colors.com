import { Http } from '@jonahsnider/util';
import { Hono } from 'hono';
import { validateParams } from 'next-api-utils';
import { z } from 'zod';
import { avatarService } from '../../teams/avatar/avatar.service';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { BaseHttpException } from '../exceptions/base.exception';

export const internalTeamController = new Hono().get('/:team/avatar.png', async (context) => {
	const params = validateParams(
		{ params: { team: context.req.param('team') } },
		z.object({
			team: TeamNumber,
		}),
	);

	const avatar = await avatarService.getAvatar(params.team);

	if (!avatar) {
		throw new BaseHttpException(`Team ${params.team} had no stored avatar.`, Http.Status.NotFound, 'E_TEAM_NOT_FOUND');
	}
});
