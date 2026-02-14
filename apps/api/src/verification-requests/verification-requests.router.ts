import { z } from 'zod';
import { Schema } from '../db/index.ts';
import { TeamNumber } from '../teams/dtos/team-number.dto.ts';
import { adminProcedure, publicProcedure, router } from '../trpc/trpc.ts';
import { VerificationRequest } from './dtos/verification-request.dto.ts';
import { verificationRequestsService } from './verification-requests.service.ts';

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
