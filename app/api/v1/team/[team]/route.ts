import { authService } from '@/app/api/_lib/auth/auth.service';
import { SaveTeamSchema } from '@/app/api/_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { V1TeamSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import { NoTeamColorsException } from '@/app/api/_lib/teams/exceptions/no-team-colors.exception';
import { savedColorsService } from '@/app/api/_lib/teams/saved-colors/saved-colors.service';
import { TeamsSerializer } from '@/app/api/_lib/teams/teams.serializer';
import { teamsService } from '@/app/api/_lib/teams/teams.service';
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { exceptionRouteWrapper } from '@/app/api/_lib/exception-route-wrapper';
import { NextRouteHandlerContext, validateBody, validateParams } from '@jonahsnider/nextjs-api-utils';

export const GET = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1DTO(teamNumber, team));
	},
);

export const POST = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (request, context) => {
		await authService.assertRequestAuthenticated(request);

		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const body = await validateBody(request, SaveTeamSchema);

		await savedColorsService.saveTeamColors(teamNumber, body);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			// Should never happen
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1DTO(teamNumber, team));
	},
);