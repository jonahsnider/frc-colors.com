import { validateQuery } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';
import { V1FindManyTeamsSchema } from '../../_lib/teams/dtos/v1/team.dto';
import { TeamsSerializer } from '../../_lib/teams/teams.serializer';
import { teamsService } from '../../_lib/teams/teams.service';

export const GET = exceptionRouteWrapper.wrapRoute<V1FindManyTeamsSchema>(async (request) => {
	const query = validateQuery(
		request,
		z.object({
			team: TeamNumberSchema.array()
				.max(100)
				.or(TeamNumberSchema.transform((teamNumber) => [teamNumber]))
				.default([]),
		}),
	);

	const teamColors = await teamsService.getManyTeamColors(query.team);

	return NextResponse.json(TeamsSerializer.findManyTeamsToV1Dto(teamColors));
});
