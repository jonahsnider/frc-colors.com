import { Http } from '@jonahsnider/util';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validateParams } from 'next-api-utils';
import { z } from 'zod';
import { configService } from '../../config/config.service';
import { avatarService } from '../../teams/avatar/avatar.service';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { BaseHttpException } from '../exceptions/base.exception';

export const internalTeamController = new Hono()
	.use(
		'*',
		cors({
			origin: configService.websiteUrl,
		}),
	)
	.get('/:team/avatar.png', async (context) => {
		const params = validateParams(
			{ params: { team: context.req.param('team') } },
			z.object({
				team: TeamNumber,
			}),
		);

		const avatar = await avatarService.getAvatar(params.team);

		if (!avatar) {
			throw new BaseHttpException(
				`Team ${params.team} had no stored avatar.`,
				Http.Status.NotFound,
				'E_TEAM_NOT_FOUND',
			);
		}

		return context.body(avatar.buffer as ArrayBuffer, { headers: { 'Content-Type': 'image/png' } });
	});
