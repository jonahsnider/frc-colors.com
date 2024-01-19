import { validateQuery } from 'next-api-utils';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { authService } from '../../_lib/auth/auth.service';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';
import { V1FindManyVerificationRequestsSchema } from '../../_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import { VerificationRequestsSerializer } from '../../_lib/teams/verification-requests/verification-requests.serializer';
import { verificationRequestsService } from '../../_lib/teams/verification-requests/verification-requests.service';

export const GET = exceptionRouteWrapper.wrapRoute<V1FindManyVerificationRequestsSchema>(async (request) => {
	await authService.assertRequestAuthenticated(request);

	const query = validateQuery(
		request,
		z.object({
			team: TeamNumberSchema.optional(),
		}),
	);

	const verificationRequests = await verificationRequestsService.findManyVerificationRequests(query.team);

	return NextResponse.json(VerificationRequestsSerializer.findManyVerificationRequestsToV1Dto(verificationRequests));
});
