import { z } from 'zod';
import type { Id } from '../../../convex/_generated/dataModel';
import { VerificationRequestStatus } from '../../review-status.ts';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

export const VerificationRequest = z.object({
	team: TeamNumber,
	_id: z.string().transform((value) => value as Id<'verificationRequests'>),
	createdAt: z.number(),
	updatedAt: z.number().optional(),
	status: z.enum(VerificationRequestStatus),
});
export type VerificationRequest = z.output<typeof VerificationRequest>;
