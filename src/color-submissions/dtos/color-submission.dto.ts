import { z } from 'zod';
import type { Id } from '../../../convex/_generated/dataModel';
import { HexColorCode } from '../../colors/dtos/colors.dto.ts';
import { VerificationRequestStatus } from '../../review-status.ts';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

export const ColorSubmission = z.object({
	createdAt: z.number(),
	updatedAt: z.number().optional(),
	_id: z.string().transform((value) => value as Id<'colorSubmissions'>),
	status: z.enum(VerificationRequestStatus),
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
