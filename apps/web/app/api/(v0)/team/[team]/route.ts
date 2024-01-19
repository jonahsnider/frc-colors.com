import { exceptionRouteWrapper } from '@/apps/web/app/api/_lib/exception-route-wrapper';
import { TeamNumberSchema } from '@/apps/web/app/api/_lib/teams/dtos/team-number.dto';
import { V0TeamSchema } from '@/apps/web/app/api/_lib/teams/dtos/v0/team.dto';
import { NoTeamColorsException } from '@/apps/web/app/api/_lib/teams/exceptions/no-team-colors.exception';
import { TeamsSerializer } from '@/apps/web/app/api/_lib/teams/teams.serializer';
import { teamsService } from '@/apps/web/app/api/_lib/teams/teams.service';
import { NextRouteHandlerContext, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = exceptionRouteWrapper.wrapRoute<V0TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV0Dto(teamNumber, team));
	},
);
