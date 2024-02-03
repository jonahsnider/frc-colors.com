import { Comparable, Sort } from '@jonahsnider/util';
import { TRPCError } from '@trpc/server';
import { ms } from 'convert';
import { and, eq, gt, ne, or } from 'drizzle-orm';
import { db } from '../db/db';
import { Schema } from '../db/index';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { ColorSubmission, CreateColorSubmission } from './dtos/color-submission.dto';

export class ColorSubmissionsService {
	static dbColorSubmissionToDto(row: typeof Schema.colorSubmissions.$inferSelect): ColorSubmission {
		return {
			id: row.uuid,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,

			teamNumber: row.team,
			status: row.status,
			primaryHex: row.primaryHex,
			secondaryHex: row.secondaryHex,
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

	async findColorSubmission(id: string): Promise<ColorSubmission | undefined> {
		const submissions = await db.select().from(Schema.colorSubmissions).where(eq(Schema.colorSubmissions.uuid, id));

		const [submission] = submissions;

		if (!submission) {
			return undefined;
		}

		return ColorSubmissionsService.dbColorSubmissionToDto(submission);
	}

	async findManyColorSubmissions(team?: TeamNumber): Promise<ColorSubmission[]> {
		const condition = team
			? eq(Schema.colorSubmissions.team, team)
			: or(
					eq(Schema.colorSubmissions.status, Schema.VerificationRequestStatus.Pending),
					and(
						ne(Schema.colorSubmissions.status, Schema.VerificationRequestStatus.Pending),
						gt(Schema.colorSubmissions.updatedAt, new Date(Date.now() - ms('7d'))),
					),
			  );

		const colorSubmissions = await db.select().from(Schema.colorSubmissions).where(condition);

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
		let insertedRow: typeof Schema.colorSubmissions.$inferSelect | undefined;

		await db.transaction(async (tx) => {
			await tx.insert(Schema.teams).values({ number: body.teamNumber }).onConflictDoNothing();

			[insertedRow] = await tx
				.insert(Schema.colorSubmissions)
				.values({
					team: body.teamNumber,
					primaryHex: body.primaryHex,
					secondaryHex: body.secondaryHex,
					status: Schema.VerificationRequestStatus.Pending,
				})
				.returning();
		});

		if (!insertedRow) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Failed to insert color submission',
			});
		}

		return ColorSubmissionsService.dbColorSubmissionToDto(insertedRow);
	}

	async modifyColorSubmissionStatus(id: string, status: Schema.VerificationRequestStatus): Promise<ColorSubmission> {
		const updated = await db
			.update(Schema.colorSubmissions)
			.set({ status, updatedAt: new Date() })
			.where(eq(Schema.colorSubmissions.uuid, id))
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
