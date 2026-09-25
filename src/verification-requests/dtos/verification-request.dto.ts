import { z } from 'zod';
import { VerificationRequestStatus } from '../../review-status.ts';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

export const VerificationRequest = z.object({
	team: TeamNumber,
	id: z.uuid(),
	createdAt: z.number(),
	updatedAt: z.number().optional(),
	status: z.enum(VerificationRequestStatus),
});
export type VerificationRequest = z.output<typeof VerificationRequest>;
