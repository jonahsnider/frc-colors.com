import { authService } from '@/app/api/_lib/auth/auth.service';
import { exceptionRouteWrapper } from '@/app/api/_lib/exception-route-wrapper';
import { colorsCacheService } from '@/app/api/_lib/teams/colors/cache/colors-cache.service';
import { savedColorsService } from '@/app/api/_lib/teams/colors/saved-colors/saved-colors.service';
import { SaveTeamSchema } from '@/app/api/_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { V1TeamSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import { NoTeamColorsException } from '@/app/api/_lib/teams/exceptions/no-team-colors.exception';
import { TeamsSerializer } from '@/app/api/_lib/teams/teams.serializer';
import { teamsService } from '@/app/api/_lib/teams/teams.service';
import { NextRouteHandlerContext, validateBody, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1Dto(teamNumber, team));
	},
);

export const POST = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (request, context) => {
		await authService.assertRequestAuthenticated(request);

		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const body = await validateBody(request, SaveTeamSchema);

		await Promise.all([
			savedColorsService.saveTeamColors(teamNumber, body),
			colorsCacheService.setTeamColors(teamNumber, { ...body, verified: true }),
		]);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			// Should never happen
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1Dto(teamNumber, team));
	},
);
