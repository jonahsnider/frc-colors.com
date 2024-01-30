import { Comparable, Sort } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { ms } from 'convert';
import { and, eq, gt, ne, or } from 'drizzle-orm';
import { db } from '../db/db';
import { Schema } from '../db/index';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { ColorSubmission, CreateColorSubmission } from './dtos/color-submission.dto';

export class ColorSubmissionsService {
	static dbColorSubmissionToDto(row: typeof Schema.colorFormSubmissions.$inferSelect): ColorSubmission {
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

	private static orderVerificationRequestStatus(status: Schema.VerificationRequestStatus): Comparable {
		switch (status) {
			case Schema.VerificationRequestStatus.Pending:
				return 0;
			case Schema.VerificationRequestStatus.Finished:
			case Schema.VerificationRequestStatus.Rejected:
				return 1;
		}
	}

	async findColorSubmission(id: number): Promise<ColorSubmission | undefined> {
		const submissions = await db
			.select()
			.from(Schema.colorFormSubmissions)
			.where(eq(Schema.colorFormSubmissions.id, id));

		const [submission] = submissions;

		if (!submission) {
			return undefined;
		}

		return ColorSubmissionsService.dbColorSubmissionToDto(submission);
	}

	async findManyColorSubmissions(team?: TeamNumber): Promise<ColorSubmission[]> {
		const condition = team
			? eq(Schema.colorFormSubmissions.teamId, team)
			: or(
					eq(Schema.colorFormSubmissions.status, Schema.VerificationRequestStatus.Pending),
					and(
						ne(Schema.colorFormSubmissions.status, Schema.VerificationRequestStatus.Pending),
						gt(Schema.colorFormSubmissions.updatedAt, new Date(Date.now() - ms('7d'))),
					),
			  );

		const colorSubmissions = await db.select().from(Schema.colorFormSubmissions).where(condition);

		if (team) {
			colorSubmissions.sort(Sort.descending((submission) => submission.createdAt));
		} else {
			colorSubmissions.sort(
				Sort.combine(
					Sort.ascending((submission) => ColorSubmissionsService.orderVerificationRequestStatus(submission.status)),
					Sort.descending((submission) => submission.updatedAt),
					Sort.descending((submission) => submission.createdAt),
				),
			);
		}

		return colorSubmissions.map((row) => ColorSubmissionsService.dbColorSubmissionToDto(row));
	}

	async createColorSubmission(body: CreateColorSubmission): Promise<ColorSubmission> {
		const inserted = await db
			.insert(Schema.colorFormSubmissions)
			.values({
				teamId: body.teamNumber,
				primaryColorHex: body.primaryHex,
				secondaryColorHex: body.secondaryHex,
				status: Schema.VerificationRequestStatus.Pending,
			})
			.returning();

		const [insertedRow] = inserted;

		if (!insertedRow) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to insert color submission',
			});
		}

		return ColorSubmissionsService.dbColorSubmissionToDto(insertedRow);
	}

	async modifyColorSubmissionStatus(id: number, status: Schema.VerificationRequestStatus): Promise<ColorSubmission> {
		const updated = await db
			.update(Schema.colorFormSubmissions)
			.set({ status, updatedAt: new Date() })
			.where(eq(Schema.colorFormSubmissions.id, id))
			.returning();

		const [updatedRow] = updated;

		if (!updatedRow) {
			throw new TRPCError({
				code: 'NOT_FOUND',
				message: 'Color submission not found',
			});
		}

		return ColorSubmissionsService.dbColorSubmissionToDto(updatedRow);
	}
}

export const colorSubmissionsService = new ColorSubmissionsService();
