import { z } from 'zod';
import { HexColorCodeSchema } from '../../../colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../../../dtos/team-number.dto';

export const V1CreateColorSubmissionSchema = z.object({
	teamNumber: TeamNumberSchema,
	primaryHex: HexColorCodeSchema,
	secondaryHex: HexColorCodeSchema,
});
export type V1CreateColorSubmissionSchema = z.infer<typeof V1CreateColorSubmissionSchema>;
