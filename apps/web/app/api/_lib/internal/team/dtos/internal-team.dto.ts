import { z } from 'zod';
import { HexColorCodeSchema } from '../../../teams/colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../../../teams/dtos/team-number.dto';

export const InternalTeamSchema = z.object({
	teamName: z.string().nullable(),
	teamNumber: TeamNumberSchema,
	colors: z
		.object({
			primaryHex: HexColorCodeSchema,
			secondaryHex: HexColorCodeSchema,
			verified: z.boolean(),
		})
		.nullable(),
});
export type InternalTeamSchema = z.infer<typeof InternalTeamSchema>;
