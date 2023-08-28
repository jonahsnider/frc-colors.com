import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '../../_lib/auth/auth.service';
import { BaseHttpException } from '../../_lib/exceptions/base.exception';
import { ExceptionSchema } from '../../_lib/exceptions/dtos/exception.dto';
import { SaveTeamSchema } from '../../_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';
import { TeamSchema } from '../../_lib/teams/dtos/team.dto';
import { savedColorsService } from '../../_lib/teams/saved-colors/saved-colors.service';
import { teamsService } from '../../_lib/teams/teams.service';
import { validateBody, validateParams } from '../../_lib/util/validate-request';

export async function GET(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<TeamSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ team: TeamNumberSchema }));

	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const team = await teamsService.getTeamColors(teamNumber);

	if (team instanceof BaseHttpException) {
		return team.toResponse();
	}

	return NextResponse.json(team);
}

export async function POST(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<TeamSchema | ExceptionSchema>> {
	const authError = await authService.validateRequest(request);
	if (authError) {
		return authError.toResponse();
	}

	const params = validateParams(context, z.object({ team: TeamNumberSchema }));
	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const body = await validateBody(request, SaveTeamSchema);
	if (body instanceof NextResponse) {
		return body;
	}

	await savedColorsService.saveTeamColors(teamNumber, body);

	const team = await teamsService.getTeamColors(teamNumber);

	if (team instanceof BaseHttpException) {
		// Should never happen
		return team.toResponse();
	}

	return NextResponse.json(team);
}
