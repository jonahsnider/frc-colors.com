import { z } from 'zod';
import { HexColorCodeSchema } from '../../colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../team-number.dto';

export const V0ColorsSchema = z.object({
	primaryHex: HexColorCodeSchema,
	secondaryHex: HexColorCodeSchema,
	verified: z.boolean(),
});
export type V0ColorsSchema = z.infer<typeof V0ColorsSchema>;

export const V0TeamSchema = z.object({
	teamNumber: TeamNumberSchema,
	colors: V0ColorsSchema,
});
export type V0TeamSchema = z.infer<typeof V0TeamSchema>;

export const V0FindManyTeamsSchema = z.object({
	teams: z.array(V0TeamSchema.nullable()),
});
export type V0FindManyTeamsSchema = z.infer<typeof V0FindManyTeamsSchema>;
