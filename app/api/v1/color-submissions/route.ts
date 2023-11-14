import { validateBody } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { colorSubmissionsService } from '../../_lib/teams/color-submissions/color-submissions.service';
import { V1CreateColorSubmissionSchema } from '../../_lib/teams/color-submissions/dtos/v1/create-color-submission.dto';

export const POST = exceptionRouteWrapper.wrapRoute<{ success: true }>(async (request) => {
	const body = await validateBody(request, V1CreateColorSubmissionSchema);

	await colorSubmissionsService.createVerificationRequest(body);

	return NextResponse.json({ success: true });
});
