import { z } from 'zod';
import { TeamNumberSchema } from './team-number.dto';
import { HexColorCode } from '../../colors/dtos/hex-color-code.dto';

export const TeamSchema = z.object({
	teamNumber: TeamNumberSchema,
	colors: z.object({
		primaryHex: HexColorCode,
		secondaryHex: HexColorCode,
		verified: z.boolean(),
	}),
});
export type TeamSchema = z.infer<typeof TeamSchema>;

export const FindManyTeamsSchema = z.object({
	teams: z.array(TeamSchema),
});
export type FindManyTeamsSchema = z.infer<typeof FindManyTeamsSchema>;
