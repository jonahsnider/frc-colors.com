import { z } from 'zod';
import { Schema } from '../../db/index';
import { TeamNumber } from '../../teams/dtos/team-number.dto';

export const VerificationRequest = z.object({
	team: TeamNumber,
	id: z.uuid(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
	status: z.enum(Schema.VerificationRequestStatus),
});
export type VerificationRequest = z.output<typeof VerificationRequest>;
