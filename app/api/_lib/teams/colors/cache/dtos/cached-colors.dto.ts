import { z } from 'zod';
import { TeamColorsSchema } from '../../saved-colors/dtos/team-colors-dto';

export const CachedColorsSchema = TeamColorsSchema.or(
	z.object({
		missing: z.literal(true),
	}),
);
export type CachedColorsSchema = z.infer<typeof CachedColorsSchema>;
