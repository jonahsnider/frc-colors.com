import { clamp, random } from '@jonahsnider/util';
import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { validateParams } from 'next-api-utils';
import { z } from 'zod';
import { configService } from '../../config/config.service.ts';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

const ERROR_RATE_START = 0.1;
const ERROR_RATE_START_AT = Date.UTC(2026, 8, 1);
const ERROR_RATE_END_AT = Date.UTC(2026, 11, 1);

export function getLegacyAvatarErrorRate(now = Date.now()): number {
	const progress = (now - ERROR_RATE_START_AT) / (ERROR_RATE_END_AT - ERROR_RATE_START_AT);
	return clamp(ERROR_RATE_START + progress * (1 - ERROR_RATE_START), ERROR_RATE_START, 1);
}

export const internalTeamController = new Hono()
	.use(
		'*',
		cors({
			origin: configService.websiteUrl,
		}),
	)
	.get('/:team/avatar.png', async (context) => {
		const params = await validateParams(
			{ params: Promise.resolve({ team: context.req.param('team') }) },
			z.object({
				team: TeamNumber,
			}),
		);

		if (Math.random() < getLegacyAvatarErrorRate()) {
			context.header('Cache-Control', 'no-store');
			return context.json(
				{
					error: `This legacy avatar endpoint has been retired. Migrate to https://avatars.frc.sh/teams/${params.team}.png.`,
				},
				410,
			);
		}

		return context.redirect(`https://avatars.frc.sh/teams/${params.team}.png`, 308);
	});
