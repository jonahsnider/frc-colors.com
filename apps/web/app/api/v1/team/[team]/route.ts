import { authService } from '@/apps/web/app/api/_lib/auth/auth.service';
import { Schema } from '@/apps/web/app/api/_lib/db/index';
import { exceptionRouteWrapper } from '@/apps/web/app/api/_lib/exception-route-wrapper';

import { colorsService } from '@/apps/web/app/api/_lib/teams/colors/colors.service';
import { TeamColorsSchema } from '@/apps/web/app/api/_lib/teams/colors/saved-colors/dtos/team-colors-dto';

import { SaveTeamSchema } from '@/apps/web/app/api/_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema } from '@/apps/web/app/api/_lib/teams/dtos/team-number.dto';
import { V1TeamSchema } from '@/apps/web/app/api/_lib/teams/dtos/v1/team.dto';
import { NoTeamColorsException } from '@/apps/web/app/api/_lib/teams/exceptions/no-team-colors.exception';
import { TeamsSerializer } from '@/apps/web/app/api/_lib/teams/teams.serializer';
import { teamsService } from '@/apps/web/app/api/_lib/teams/teams.service';
import { verificationRequestsService } from '@/apps/web/app/api/_lib/teams/verification-requests/verification-requests.service';
import { NextRouteHandlerContext, validateBody, validateParams } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export const GET = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (_request, context) => {
		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1Dto(teamNumber, team));
	},
);

export const POST = exceptionRouteWrapper.wrapRoute<V1TeamSchema, NextRouteHandlerContext<{ team: string }>>(
	async (request, context) => {
		await authService.assertRequestAuthenticated(request);

		const params = validateParams(context, z.object({ team: TeamNumberSchema }));

		const teamNumber = TeamNumberSchema.parse(params.team);

		const body = await validateBody(request, SaveTeamSchema);

		const colors: TeamColorsSchema = {
			primary: body.primary,
			secondary: body.secondary,
			verified: true,
		};

		await Promise.all([
			colorsService.setTeamColors(teamNumber, colors),
			verificationRequestsService.updateVerificationStatusByTeam(teamNumber, Schema.VerificationRequestStatus.Finished),
		]);

		const team = await teamsService.getTeamColors(teamNumber);

		if (!team) {
			// Should never happen
			throw new NoTeamColorsException(teamNumber);
		}

		return NextResponse.json(TeamsSerializer.teamToV1Dto(teamNumber, team));
	},
);
