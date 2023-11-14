import { desc, eq } from 'drizzle-orm';
import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { ColorSubmissionsSerializer } from './color-submissions.serializer';
import { V1CreateColorSubmissionSchema } from './dtos/v1/create-color-submission.dto';
import { ColorSubmissionNotFoundException } from './exceptions/color-submission-not-found.exception';
import { ColorSubmission } from './interfaces/color-submission.interface';

export class ColorSubmissionsService {
	// biome-ignore lint/nursery/noEmptyBlockStatements: This has a parameter property
	constructor(private readonly db: Db) {}

	async findColorSubmission(id: number): Promise<ColorSubmission | undefined> {
		const submissions = await this.db
			.select()
			.from(Schema.colorFormSubmissions)
			.where(eq(Schema.colorFormSubmissions.id, id));

		if (submissions.length === 0) {
			return undefined;
		}

		return ColorSubmissionsSerializer.dbColorSubmissionToInterface(submissions[0]);
	}

	async findManyColorSubmissions(): Promise<ColorSubmission[]> {
		const colorSubmissions = await this.db
			.select()
			.from(Schema.colorFormSubmissions)
			.where(eq(Schema.colorFormSubmissions.status, Schema.VerificationRequestStatus.Pending))
			.orderBy(desc(Schema.colorFormSubmissions.createdAt));

		return colorSubmissions.map((row) => ColorSubmissionsSerializer.dbColorSubmissionToInterface(row));
	}

	async createColorSubmission(body: V1CreateColorSubmissionSchema): Promise<void> {
		await this.db.insert(Schema.colorFormSubmissions).values({
			teamId: body.teamNumber,
			primaryColorHex: body.primaryHex,
			secondaryColorHex: body.secondaryHex,
			status: Schema.VerificationRequestStatus.Pending,
		});
	}

	async modifyColorSubmissionStatus(id: number, status: Schema.VerificationRequestStatus): Promise<ColorSubmission> {
		const updated = await this.db
			.update(Schema.colorFormSubmissions)
			.set({ status })
			.where(eq(Schema.colorFormSubmissions.id, id))
			.returning();

		if (updated.length === 0) {
			throw new ColorSubmissionNotFoundException(id);
		}

		return ColorSubmissionsSerializer.dbColorSubmissionToInterface(updated[0]);
	}
}

export const colorSubmissionsService = new ColorSubmissionsService(db);
