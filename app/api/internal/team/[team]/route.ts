import { exceptionRouteWrapper } from '@/app/api/_lib/exception-route-wrapper';
import { InternalTeamSchema } from '@/app/api/_lib/internal/team/dtos/internal-team.dto';
import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { TeamsSerializer } from '@/app/api/_lib/teams/teams.serializer';
import { teamsService } from '@/app/api/_lib/teams/teams.service';
import { NextRouteHandlerContext, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = exceptionRouteWrapper.wrapRoute<InternalTeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const internalTeam = await teamsService.getInternalTeam(teamNumber);

		return NextResponse.json(TeamsSerializer.internalTeamToDto(internalTeam));
	},
);
