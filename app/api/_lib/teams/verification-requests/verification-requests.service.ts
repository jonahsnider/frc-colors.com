import { eq } from 'drizzle-orm';
import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { VerificationRequest } from './interfaces/verification-request.interface';

export class VerificationRequestsService {
	private static dbVerificationRequestToVerificationRequest(row: {
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

	constructor(private readonly db: Db) {}

	async requestVerification(teamNumber: TeamNumberSchema): Promise<VerificationRequest> {
		const [created] = await this.db
			.insert(Schema.colorVerificationRequests)
			.values({ teamId: teamNumber, status: Schema.VerificationRequestStatus.Pending })
			.returning();

		return VerificationRequestsService.dbVerificationRequestToVerificationRequest(created);
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

		return VerificationRequestsService.dbVerificationRequestToVerificationRequest(updated[0]);
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

		return VerificationRequestsService.dbVerificationRequestToVerificationRequest(updated[0]);
	}
}

export const verificationRequestsService = new VerificationRequestsService(db);
