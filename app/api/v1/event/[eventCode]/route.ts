import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BaseHttpException } from '../../../_lib/exceptions/base.exception';
import { ExceptionSchema } from '../../../_lib/exceptions/dtos/exception.dto';
import { FindManyTeamsByEventSchema } from '../../../_lib/teams/dtos/event.dto';
import { TeamSchema } from '../../../_lib/teams/dtos/team.dto';
import { teamsService } from '../../../_lib/teams/teams.service';
import { validateParams } from '../../../_lib/util/validate-request';

export async function GET(
	request: NextRequest,
	context: { params: { eventCode: string } },
): Promise<NextResponse<FindManyTeamsByEventSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ eventCode: z.string().min(1).max(64) }));

	if (params instanceof NextResponse) {
		return params;
	}

	let teamColors: TeamSchema[] = [];

	try {
		teamColors = await teamsService.getTeamColorsForEvent(params.eventCode);
	} catch (error) {
		if (error instanceof BaseHttpException) {
			return error.toResponse();
		}

		throw error;
	}

	return NextResponse.json({
		teams: teamColors,
	});
}
