import assert from 'node:assert/strict';
import { type Comparable, Sort } from '@jonahsnider/util';
import { ms } from 'convert';
import { and, eq, gt, ne, or } from 'drizzle-orm';
import { db } from '../db/db';
import { Schema } from '../db/index';
import type { TeamNumber } from '../teams/dtos/team-number.dto';
import type { VerificationRequest } from './dtos/verification-request.dto';

export class VerificationRequestsService {
	private static dbVerificationRequestToDto(row: typeof Schema.verificationRequests.$inferSelect): VerificationRequest {
		return {
			id: row.uuid,
			createdAt: row.createdAt,
			updatedAt: row.updatedAt ?? undefined,
			team: row.team,
			status: row.status,
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

	async requestVerification(teamNumber: TeamNumber): Promise<VerificationRequest> {
		let insertedRow: typeof Schema.verificationRequests.$inferSelect | undefined;

		await db.transaction(async (tx) => {
			await tx.insert(Schema.teams).values({ number: teamNumber }).onConflictDoNothing();

			[insertedRow] = await tx
				.insert(Schema.verificationRequests)
				.values({ team: teamNumber, status: Schema.VerificationRequestStatus.Pending })
				.returning();
		});

		assert(insertedRow);

		return VerificationRequestsService.dbVerificationRequestToDto(insertedRow);
	}

	async updateVerificationStatus(
		id: string,
		status: Schema.VerificationRequestStatus,
	): Promise<VerificationRequest | undefined> {
		const updated = await db
			.update(Schema.verificationRequests)
			.set({ status, updatedAt: new Date() })
			.where(eq(Schema.verificationRequests.uuid, id))
			.returning();

		const verificationRequest = updated[0];

		if (!verificationRequest) {
			return undefined;
		}

		return VerificationRequestsService.dbVerificationRequestToDto(verificationRequest);
	}

	async updatePendingVerificationStatusesByTeam(
		teamNumber: TeamNumber,
		status: Schema.VerificationRequestStatus,
	): Promise<VerificationRequest[]> {
		const updated = await db
			.update(Schema.verificationRequests)
			.set({ status, updatedAt: new Date() })
			.where(
				and(
					eq(Schema.verificationRequests.team, teamNumber),
					eq(Schema.verificationRequests.status, Schema.VerificationRequestStatus.Pending),
				),
			)
			.returning();

		return updated.map(VerificationRequestsService.dbVerificationRequestToDto);
	}

	async findManyVerificationRequests(team?: TeamNumber): Promise<VerificationRequest[]> {
		const condition = team
			? eq(Schema.verificationRequests.team, team)
			: or(
					eq(Schema.verificationRequests.status, Schema.VerificationRequestStatus.Pending),
					and(
						ne(Schema.verificationRequests.status, Schema.VerificationRequestStatus.Pending),
						gt(Schema.verificationRequests.updatedAt, new Date(Date.now() - ms('7d'))),
					),
				);

		const verificationRequests = await db.select().from(Schema.verificationRequests).where(condition);

		if (team) {
			verificationRequests.sort(Sort.descending((request) => request.createdAt));
		} else {
			verificationRequests.sort(
				Sort.combine(
					Sort.ascending((request) => VerificationRequestsService.orderVerificationRequestStatus(request.status)),
					Sort.descending((request) => request.createdAt),
				),
			);
		}

		return verificationRequests.map(VerificationRequestsService.dbVerificationRequestToDto);
	}
}

export const verificationRequestsService = new VerificationRequestsService();
