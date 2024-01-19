import { exceptionRouteWrapper } from '@/apps/web/app/api/_lib/exception-route-wrapper';
import { avatarsService } from '@/apps/web/app/api/_lib/teams/avatars/avatars.service';
import { AvatarNotFoundException } from '@/apps/web/app/api/_lib/teams/avatars/exceptions/avatar-not-found.exception';
import { TeamNumberSchema } from '@/apps/web/app/api/_lib/teams/dtos/team-number.dto';
import { NextRouteHandlerContext, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = exceptionRouteWrapper.wrapRoute<Buffer, NextRouteHandlerContext<{ team: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const avatar = await avatarsService.getAvatar(teamNumber);

		if (!avatar) {
			throw new AvatarNotFoundException();
		}

		return new NextResponse(avatar, {
			headers: {
				'Content-Type': 'image/png',
			},
		});
	},
);
