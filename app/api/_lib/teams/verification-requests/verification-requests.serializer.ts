import { Schema } from '../../db/index';
import { VerificationRequest } from './interfaces/verification-request.interface';

export class VerificationRequestsSerializer {
	static dbVerificationRequestToDto(row: {
		id: number;
		createdAt: Date;
		updatedAt: Date | null;
		teamId: number;
		status: Schema.VerificationRequestStatus;
	}): VerificationRequest {
		return {
			id: row.id,
			team: row.teamId,
			createdAt: row.createdAt,
			status: row.status,
			updatedAt: row.updatedAt ?? undefined,
		};
	}

	private constructor() {}
}
