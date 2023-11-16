import { Comparable, Sort } from '@jonahsnider/util';
import { ms } from 'convert';
import { and, eq, gt, ne, or } from 'drizzle-orm';
import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { VerificationRequest } from './interfaces/verification-request.interface';
import { VerificationRequestsSerializer } from './verification-requests.serializer';

export class VerificationRequestsService {
	private static orderVerificationRequestStatus(status: Schema.VerificationRequestStatus): Comparable {
		switch (status) {
			case Schema.VerificationRequestStatus.Pending:
				return 0;
			case Schema.VerificationRequestStatus.Finished:
			case Schema.VerificationRequestStatus.Rejected:
				return 1;
		}
	}

	// biome-ignore lint/nursery/noEmptyBlockStatements: This has a parameter property
	constructor(private readonly db: Db) {}

	async requestVerification(teamNumber: TeamNumberSchema): Promise<VerificationRequest> {
		const [created] = await this.db
			.insert(Schema.colorVerificationRequests)
			.values({ teamId: teamNumber, status: Schema.VerificationRequestStatus.Pending })
			.returning();

		return VerificationRequestsSerializer.dbVerificationRequestToDto(created);
	}

	async updateVerificationStatus(
		id: number,
		status: Schema.VerificationRequestStatus,
	): Promise<VerificationRequest | undefined> {
		const updated = await this.db
			.update(Schema.colorVerificationRequests)
			.set({ status, updatedAt: new Date() })
			.where(eq(Schema.colorVerificationRequests.id, id))
			.returning();

		if (updated.length === 0) {
			return undefined;
		}

		return VerificationRequestsSerializer.dbVerificationRequestToDto(updated[0]);
	}

	async updateVerificationStatusByTeam(
		teamNumber: TeamNumberSchema,
		status: Schema.VerificationRequestStatus,
	): Promise<VerificationRequest | undefined> {
		const updated = await this.db
			.update(Schema.colorVerificationRequests)
			.set({ status, updatedAt: new Date() })
			.where(eq(Schema.colorVerificationRequests.teamId, teamNumber))
			.returning();

		if (updated.length === 0) {
			return undefined;
		}

		return VerificationRequestsSerializer.dbVerificationRequestToDto(updated[0]);
	}

	async findManyVerificationRequests(team?: TeamNumberSchema): Promise<VerificationRequest[]> {
		const condition = team
			? eq(Schema.colorVerificationRequests.teamId, team)
			: or(
					eq(Schema.colorVerificationRequests.status, Schema.VerificationRequestStatus.Pending),
					and(
						ne(Schema.colorVerificationRequests.status, Schema.VerificationRequestStatus.Pending),
						gt(Schema.colorVerificationRequests.updatedAt, new Date(Date.now() - ms('7d'))),
					),
			  );

		const verificationRequests = await this.db.select().from(Schema.colorVerificationRequests).where(condition);

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

		return verificationRequests.map(VerificationRequestsSerializer.dbVerificationRequestToDto);
	}
}

export const verificationRequestsService = new VerificationRequestsService(db);
