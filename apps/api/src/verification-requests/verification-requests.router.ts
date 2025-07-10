import { z } from 'zod';
import { Schema } from '../db/index';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { adminProcedure, publicProcedure, router } from '../trpc/trpc';
import { VerificationRequest } from './dtos/verification-request.dto';
import { verificationRequestsService } from './verification-requests.service';

export const verificationRequestsRouter = router({
	getAll: adminProcedure
		.output(VerificationRequest.array())
		.query(() => verificationRequestsService.findManyVerificationRequests()),
	getAllForTeam: adminProcedure
		.input(TeamNumber)
		.output(VerificationRequest.array())
		.query(({ input }) => verificationRequestsService.findManyVerificationRequests(input)),
	createForTeam: publicProcedure
		.input(TeamNumber)
		.output(VerificationRequest)
		.mutation(({ input }) => verificationRequestsService.requestVerification(input)),
	updateStatus: adminProcedure
		.input(z.object({ id: z.uuid(), status: z.enum(Schema.VerificationRequestStatus) }))
		.mutation(({ input }) => verificationRequestsService.updateVerificationStatus(input.id, input.status)),
	updateStatusForTeam: adminProcedure
		.input(z.object({ team: TeamNumber, status: z.enum(Schema.VerificationRequestStatus) }))
		.mutation(({ input }) =>
			verificationRequestsService.updatePendingVerificationStatusesByTeam(input.team, input.status),
		),
});
