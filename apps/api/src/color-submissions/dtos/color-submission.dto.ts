import { z } from 'zod';
import { HexColorCode } from '../../colors/dtos/colors.dto.ts';
import { Schema } from '../../db/index.ts';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

export const ColorSubmission = z.object({
	createdAt: z.date(),
	updatedAt: z.date().optional(),
	id: z.uuid(),
	status: z.enum(Schema.VerificationRequestStatus),
	teamNumber: TeamNumber,
	primaryHex: HexColorCode,
	secondaryHex: HexColorCode,
});
export type ColorSubmission = z.output<typeof ColorSubmission>;

export const CreateColorSubmission = ColorSubmission.pick({
	primaryHex: true,
	secondaryHex: true,
	teamNumber: true,
});
export type CreateColorSubmission = z.output<typeof CreateColorSubmission>;
