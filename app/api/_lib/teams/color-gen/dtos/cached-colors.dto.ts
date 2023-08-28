import { z } from 'zod';
import { TeamColorsSchema } from '../../saved-colors/dtos/team-colors-dto';

export const CachedColorsSchema = TeamColorsSchema.pick({
	primary: true,
	secondary: true,
});
export type CachedColorsSchema = z.infer<typeof CachedColorsSchema>;
