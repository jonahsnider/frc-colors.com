import { z } from 'zod';
import { HexColorCode } from '../../colors/dtos/colors.dto';
import { Schema } from '../../db/index';
import { TeamNumber } from '../../teams/dtos/team-number.dto';

export const ColorSubmission = z.object({
	createdAt: z.date(),
	updatedAt: z.date().optional(),
	id: z.number().int().positive(),
	status: z.nativeEnum(Schema.VerificationRequestStatus),
	teamNumber: TeamNumber,
	primaryHex: HexColorCode,
	secondaryHex: HexColorCode,
});
export type ColorSubmission = z.infer<typeof ColorSubmission>;

export const CreateColorSubmission = ColorSubmission.pick({
	primaryHex: true,
	secondaryHex: true,
	teamNumber: true,
});
export type CreateColorSubmission = z.infer<typeof CreateColorSubmission>;
