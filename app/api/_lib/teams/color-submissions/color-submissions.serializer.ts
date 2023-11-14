import { Schema } from '../../db/index';
import { HexColorCodeSchema } from '../colors/saved-colors/dtos/hex-color-code.dto';
import { ColorSubmissionSchema } from './dtos/color-submission.dto';
import { V1FindManyColorSubmissionsSchema } from './dtos/v1/color-submission.dto';
import { ColorSubmission } from './interfaces/color-submission.interface';

export class ColorSubmissionsSerializer {
	static dbColorSubmissionToInterface(row: {
		id: number;
		createdAt: Date;
		updatedAt: Date | null;
		teamId: number;
		status: Schema.VerificationRequestStatus;
		primaryColorHex: HexColorCodeSchema;
		secondaryColorHex: HexColorCodeSchema;
	}): ColorSubmission {
		return {
			id: row.id,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,

			teamNumber: row.teamId,
			status: row.status,
			primaryHex: row.primaryColorHex,
			secondaryHex: row.secondaryColorHex,
		};
	}

	static colorSubmissionToV1Dto(colorSubmission: ColorSubmission): ColorSubmissionSchema {
		return {
			...colorSubmission,
			updatedAt: colorSubmission.updatedAt?.toISOString() ?? null,
			createdAt: colorSubmission.createdAt.toISOString(),
		};
	}

	static findManyVerificationRequestsToV1Dto(colorSubmissions: ColorSubmission[]): V1FindManyColorSubmissionsSchema {
		return {
			colorSubmissions: colorSubmissions.map((colorSubmission) =>
				ColorSubmissionsSerializer.colorSubmissionToV1Dto(colorSubmission),
			),
		};
	}
	// biome-ignore lint/nursery/noEmptyBlockStatements: This class shouldn't have a public constructor
	private constructor() {}
}
