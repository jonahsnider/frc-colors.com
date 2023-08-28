import { z } from 'zod';

import { TeamNumberSchema } from '../../../teams/dtos/team-number.dto';
import { HexColorCodeSchema } from '../../../teams/saved-colors/dtos/hex-color-code.dto';

export const InternalTeamSchema = z.object({
	teamName: z.string().optional(),
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
