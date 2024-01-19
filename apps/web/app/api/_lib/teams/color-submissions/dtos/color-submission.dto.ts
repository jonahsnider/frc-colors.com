import { z } from 'zod';
import { Schema } from '../../../db/index';
import { HexColorCodeSchema } from '../../colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../../dtos/team-number.dto';

export const ColorSubmissionSchema = z.object({
	createdAt: z.string().datetime(),
	updatedAt: z.string().datetime().nullable(),
	id: z.number(),
	status: z.nativeEnum(Schema.VerificationRequestStatus),
	teamNumber: TeamNumberSchema,
	primaryHex: HexColorCodeSchema,
	secondaryHex: HexColorCodeSchema,
});
export type ColorSubmissionSchema = z.infer<typeof ColorSubmissionSchema>;
