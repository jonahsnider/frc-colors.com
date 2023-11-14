import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { V1CreateColorSubmissionSchema } from './dtos/v1/create-color-submission.dto';

export class ColorSubmissionsService {
	// biome-ignore lint/nursery/noEmptyBlockStatements: This has a parameter property
	constructor(private readonly db: Db) {}

	async createVerificationRequest(body: V1CreateColorSubmissionSchema): Promise<void> {
		await this.db.insert(Schema.colorFormSubmissions).values({
			teamId: body.teamNumber,
			primaryColorHex: body.primaryHex,
			secondaryColorHex: body.secondaryHex,
			status: Schema.VerificationRequestStatus.Pending,
		});
	}
}

export const colorSubmissionsService = new ColorSubmissionsService(db);
