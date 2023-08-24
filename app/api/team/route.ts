import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BaseHttpException } from '../_lib/exceptions/base.exception';
import { ExceptionSchema } from '../_lib/exceptions/dtos/exception.dto';
import { TeamNumberSchema, TeamNumberStringSchema } from '../_lib/teams/dtos/team-number.dto';
import { FindManyTeamsSchema, TeamSchema } from '../_lib/teams/dtos/team.dto';
import { teamsService } from '../_lib/teams/teams.service';
import { validateQuery } from '../_lib/util/validate-request';

export async function GET(request: NextRequest): Promise<NextResponse<FindManyTeamsSchema | ExceptionSchema>> {
	const query = validateQuery(request, z.object({ team: TeamNumberStringSchema.array().min(1) }));
	if (query instanceof NextResponse) {
		return query;
	}

	const teamNumbers = TeamNumberSchema.array().parse(query.team);

	const teamColors: TeamSchema[] = [];

	for (const teamNumber of teamNumbers) {
		const colors = await teamsService.getTeamColors(teamNumber);

		if (colors instanceof BaseHttpException) {
			return colors.toResponse();
		}

		teamColors.push({
			teamNumber,
			colors: {
				primaryHex: colors.primary,
				secondaryHex: colors.secondary,
				verified: colors.verified,
			},
		});
	}

	return NextResponse.json({
		teams: teamColors,
	});
}
