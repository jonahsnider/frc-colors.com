import { Schema } from '../../../db/index';
import { HexColorCodeSchema } from '../../colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../../dtos/team-number.dto';

export type ColorSubmission = {
	createdAt: Date;
	updatedAt: Date | undefined;
	id: number;
	status: Schema.VerificationRequestStatus;
	teamNumber: TeamNumberSchema;
	primaryHex: HexColorCodeSchema;
	secondaryHex: HexColorCodeSchema;
};
