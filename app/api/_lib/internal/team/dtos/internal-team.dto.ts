import { z } from 'zod';
import { HexColorCodeSchema } from '../../../colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../../../teams/dtos/team-number.dto';

export const InternalTeamSchema = z.object({
	teamName: z.string(),
	avatarUrl: z.string().optional(),
	teamNumber: TeamNumberSchema,
	colors: z
		.object({
			primaryHex: HexColorCodeSchema,
			secondaryHex: HexColorCodeSchema,
			verified: z.boolean(),
		})
		.optional(),
});
export type InternalTeamSchema = z.infer<typeof InternalTeamSchema>;
