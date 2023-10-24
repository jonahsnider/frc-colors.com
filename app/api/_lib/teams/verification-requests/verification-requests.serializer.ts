import { Schema } from '../../db/index';
import { V1FindManyVerificationRequestsSchema } from './dtos/v1/verification-request.dto';
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

	static findManyVerificationRequestsToV1Dto(
		verificationRequests: VerificationRequest[],
	): V1FindManyVerificationRequestsSchema {
		return {
			verificationRequests: verificationRequests.map((verificationRequest) => ({
				...verificationRequest,
				updatedAt: verificationRequest.updatedAt?.toISOString() ?? null,
				createdAt: verificationRequest.createdAt.toISOString(),
			})),
		};
	}

	// biome-ignore lint/nursery/noEmptyBlockStatements: This class shouldn't have a public constructor
	private constructor() {}
}
