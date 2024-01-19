import { Schema } from '../../../db/index';
import { TeamNumberSchema } from '../../dtos/team-number.dto';

export type VerificationRequest = {
	team: TeamNumberSchema;
	id: number;
	createdAt: Date;
	updatedAt: Date | undefined;
	status: Schema.VerificationRequestStatus;
};
