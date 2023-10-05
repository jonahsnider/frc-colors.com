import { z } from 'zod';
import { Schema } from '../../../db/index';
import { TeamNumberSchema } from '../../dtos/team-number.dto';

export const VerificationRequestSchema = z.object({
	team: TeamNumberSchema,
	id: z.number().int().positive(),
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullable(),
	status: z.nativeEnum(Schema.VerificationRequestStatus),
});
export type VerificationRequestSchema = z.infer<typeof VerificationRequestSchema>;
