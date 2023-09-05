import { V1FindManyTeamsSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import { TeamsSerializer } from '@/app/api/_lib/teams/teams.serializer';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { teamsService } from '../../../_lib/teams/teams.service';

import { exceptionRouteWrapper } from '@/app/api/_lib/exception-route-wrapper';
import { NextRouteHandlerContext, validateParams } from '@jonahsnider/nextjs-api-utils';

export const GET = exceptionRouteWrapper.wrapRoute<
	V1FindManyTeamsSchema,
	NextRouteHandlerContext<{ eventCode: string }>
>(async (_request, context) => {
	const params = validateParams(context, z.object({ eventCode: z.string().min(1).max(64) }));

	const teamColors = await teamsService.getTeamColorsForEvent(params.eventCode);

	return NextResponse.json(TeamsSerializer.findManyTeamsToV1Dto(teamColors));
});
