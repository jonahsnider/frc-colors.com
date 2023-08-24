import { ExceptionSchema } from '@/app/api/_lib/exceptions/dtos/exception.dto';
import { tbaService } from '@/app/api/_lib/tba/tba.service';
import { TeamNumberSchema, TeamNumberStringSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { validateParams } from '@/app/api/_lib/util/validate-request';
import { notFound } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

export async function GET(
	request: NextRequest,
	context: { params: { team: string } },
): Promise<NextResponse<ExceptionSchema | void>> {
	const params = validateParams(context, z.object({ team: TeamNumberStringSchema }));
	if (params instanceof NextResponse) {
		return params;
	}

	const teamNumber = TeamNumberSchema.parse(params.team);

	const avatar = await tbaService.getTeamAvatarForYear(teamNumber, new Date().getFullYear());

	if (!avatar) {
		notFound();
	}

	return new NextResponse(avatar, {
		headers: {
			'Content-Type': 'image/png',
		},
	});
}
