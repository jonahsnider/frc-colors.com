import { ExceptionSchema } from '@/app/api/_lib/exceptions/dtos/exception.dto';
import { InternalTeamSchema } from '@/app/api/_lib/internal/team/dtos/internal-team.dto';
import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { teamsService } from '@/app/api/_lib/teams/teams.service';
import { validateParams } from '@/app/api/_lib/util/validate-request';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<InternalTeamSchema | ExceptionSchema>> {
	const params = validateParams(context, z.object({ team: TeamNumberSchema }));

	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const internalTeam = await teamsService.getInternalTeam(teamNumber);

	return NextResponse.json(internalTeam);
}
