import { validateBody, validateQuery } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '../../_lib/auth/auth.service';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { ColorSubmissionsSerializer } from '../../_lib/teams/color-submissions/color-submissions.serializer';
import { colorSubmissionsService } from '../../_lib/teams/color-submissions/color-submissions.service';
import { V1FindManyColorSubmissionsSchema } from '../../_lib/teams/color-submissions/dtos/v1/color-submission.dto';
import { V1CreateColorSubmissionSchema } from '../../_lib/teams/color-submissions/dtos/v1/create-color-submission.dto';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';

export const GET = exceptionRouteWrapper.wrapRoute<V1FindManyColorSubmissionsSchema>(async (request) => {
	await authService.assertRequestAuthenticated(request);

	const query = validateQuery(
		request,
		z.object({
			team: TeamNumberSchema.optional(),
		}),
	);

	const verificationRequests = await colorSubmissionsService.findManyColorSubmissions(query.team);

	return NextResponse.json(ColorSubmissionsSerializer.findManyVerificationRequestsToV1Dto(verificationRequests));
});

export const POST = exceptionRouteWrapper.wrapRoute<{ success: true }>(async (request) => {
	const body = await validateBody(request, V1CreateColorSubmissionSchema);

	await colorSubmissionsService.createColorSubmission(body);

	return NextResponse.json({ success: true });
});
