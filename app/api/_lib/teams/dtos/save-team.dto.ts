import { z } from 'zod';
import { HexColorCodeSchema } from '../saved-colors/dtos/hex-color-code.dto';

export const SaveTeamSchema = z.object({
	primary: HexColorCodeSchema,
	secondary: HexColorCodeSchema,
});
export type SaveTeamSchema = z.infer<typeof SaveTeamSchema>;
