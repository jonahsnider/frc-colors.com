import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BaseHttpException } from '../_lib/exceptions/base.exception';
import { ExceptionSchema } from '../_lib/exceptions/dtos/exception.dto';
import { TeamNumberSchema } from '../_lib/teams/dtos/team-number.dto';
import { FindManyTeamsSchema, TeamSchema } from '../_lib/teams/dtos/team.dto';
import { teamsService } from '../_lib/teams/teams.service';
import { validateQuery } from '../_lib/util/validate-request';

export async function GET(request: NextRequest): Promise<NextResponse<FindManyTeamsSchema | ExceptionSchema>> {
	const query = validateQuery(
		request,
		z.object({
			team: TeamNumberSchema.array()
				.or(TeamNumberSchema.transform((teamNumber) => [teamNumber]))
				.default([]),
		}),
	);
	if (query instanceof NextResponse) {
		return query;
	}

	const teamNumbers = TeamNumberSchema.array().parse(query.team);

	const teamColors: Array<TeamSchema | undefined> = await Promise.all(
		teamNumbers.map(async (teamNumber) => {
			const colors = await teamsService.getTeamColors(teamNumber);

			if (colors instanceof BaseHttpException) {
				return undefined;
			}

			return {
				teamNumber,
				colors: {
					primaryHex: colors.primary,
					secondaryHex: colors.secondary,
					verified: colors.verified,
				},
			};
		}),
	);

	return NextResponse.json({
		teams: teamColors.map((team) => team ?? null),
	});
}
