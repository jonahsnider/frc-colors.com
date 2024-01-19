import { z } from 'zod';
import { HexColorCodeSchema } from './hex-color-code.dto';

export const TeamColorsSchema = z.object({
	primary: HexColorCodeSchema,
	secondary: HexColorCodeSchema,
	verified: z.boolean(),
});
export type TeamColorsSchema = z.infer<typeof TeamColorsSchema>;
