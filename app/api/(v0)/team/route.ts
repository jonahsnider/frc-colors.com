import { NextResponse } from 'next/server';
import { z } from 'zod';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';
import { teamsService } from '../../_lib/teams/teams.service';

import { validateQuery } from '@jonahsnider/nextjs-api-utils';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { V0FindManyTeamsSchema } from '../../_lib/teams/dtos/v0/team.dto';
import { TeamsSerializer } from '../../_lib/teams/teams.serializer';

export const GET = exceptionRouteWrapper.wrapRoute<V0FindManyTeamsSchema>(async (request) => {
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

	return NextResponse.json(TeamsSerializer.findManyTeamsToV0Dto(teamColors));
});
