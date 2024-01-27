import { z } from 'zod';
import { Schema } from '../../db/index';
import { TeamNumber } from '../../teams/dtos/team-number.dto';

export const VerificationRequest = z.object({
	team: TeamNumber,
	id: z.number().int().positive(),
	createdAt: z.date(),
	updatedAt: z.date().optional(),
	status: z.nativeEnum(Schema.VerificationRequestStatus),
});
export type VerificationRequest = z.infer<typeof VerificationRequest>;
