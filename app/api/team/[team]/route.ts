import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '../../_lib/auth/auth.service';
import { TeamColors } from '../../_lib/colors/interfaces/team-colors';
import { BaseHttpException } from '../../_lib/exceptions/base.exception';
import { ExceptionSchema } from '../../_lib/exceptions/dtos/exception.dto';
import { SaveTeamSchema } from '../../_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema, TeamNumberStringSchema } from '../../_lib/teams/dtos/team-number.dto';
import { TeamSchema } from '../../_lib/teams/dtos/team.dto';
import { teamsService } from '../../_lib/teams/teams.service';
import { validateBody, validateParams } from '../../_lib/util/validate-request';

function teamColorsToDTO(teamNumber: TeamNumberSchema, colors: TeamColors): TeamSchema {
	return {
		teamNumber: teamNumber,
		colors: {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		},
	};
}

export async function GET(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<TeamSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ team: TeamNumberStringSchema }));

	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const colors = await teamsService.getTeamColors(teamNumber);

	if (colors instanceof BaseHttpException) {
		return colors.toResponse();
	}

	return NextResponse.json(teamColorsToDTO(teamNumber, colors));
}

export async function POST(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<TeamSchema | ExceptionSchema>> {
	const authError = await authService.validateRequest(request);
	if (authError) {
		return authError.toResponse();
	}

	const params = validateParams(context, z.object({ team: TeamNumberStringSchema }));
	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const body = await validateBody(request, SaveTeamSchema);
	if (body instanceof NextResponse) {
		return body;
	}

	await teamsService.saveTeamColors(teamNumber, body);

	const colors = await teamsService.getTeamColors(teamNumber);

	if (colors instanceof BaseHttpException) {
		// Should never happen
		return colors.toResponse();
	}

	return NextResponse.json(teamColorsToDTO(teamNumber, colors));
}
