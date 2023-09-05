import { validateQuery } from '@jonahsnider/nextjs-api-utils';
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
				.or(TeamNumberSchema.transform((teamNumber) => [teamNumber]))
				.default([]),
		}),
	);

	const teamNumbers = TeamNumberSchema.array().parse(query.team);

	const teamColors = await teamsService.getManyTeamColors(teamNumbers);

	return NextResponse.json(TeamsSerializer.findManyTeamsToV1Dto(teamColors));
});
