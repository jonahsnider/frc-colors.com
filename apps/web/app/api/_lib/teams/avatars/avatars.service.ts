import { difference } from '@jonahsnider/util';
import * as Sentry from '@sentry/nextjs';
import { eq, inArray, lt, sql } from 'drizzle-orm';
import { CACHE_TTL_TEAM_AVATAR } from '../../config/ttls-config';
import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { TbaService, tbaService } from '../../tba/tba.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';

export class AvatarsService {
	// biome-ignore lint/nursery/noEmptyBlockStatements: This has parameter properties
	constructor(private readonly tba: TbaService, private readonly db: Db) {}

	async purgeExpiredAvatars(): Promise<void> {
		const expired = new Date(Date.now() - CACHE_TTL_TEAM_AVATAR.to('ms'));

		await this.db.delete(Schema.avatars).where(lt(Schema.avatars.createdAt, expired));
	}

	async getAvatar(teamNumber: TeamNumberSchema): Promise<Buffer | undefined> {
		return Sentry.startSpan({ name: 'Get avatar for team', op: 'function' }, async () => {
			const cached = await this.db.query.avatars.findFirst({
				where: eq(Schema.avatars.teamId, teamNumber),
			});

			if (cached) {
				return cached.png ?? undefined;
			}

			return Sentry.startSpan({ name: 'Get avatar from TBA and cache in DB', op: 'function' }, async () => {
				// Cache is missing, we should populate it
				const avatar = await this.tba.getTeamAvatarForThisYear(teamNumber);

				// Even if the avatar is missing from TBA, we store in the DB
				// Anything we can do to avoid hitting TBA
				await this.db.transaction(async (tx) => {
					await tx.insert(Schema.teams).values({ id: teamNumber }).onConflictDoNothing();
					await tx
						.insert(Schema.avatars)
						.values({ teamId: teamNumber, png: avatar ?? null })
						.onConflictDoUpdate({
							target: Schema.avatars.teamId,
							set: { png: avatar ?? null, createdAt: new Date() },
						});
				});

				return avatar;
			});
		});
	}

	async getAvatars(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, Buffer | undefined>> {
		return Sentry.startSpan({ name: 'Get many avatars for teams', op: 'function' }, async () => {
			const cached =
				teamNumbers.length > 0
					? await this.db.query.avatars.findMany({
							where: inArray(Schema.avatars.teamId, teamNumbers),
							columns: {
								png: true,
								teamId: true,
							},
					  })
					: [];
			const avatars = new Map<TeamNumberSchema, Buffer | undefined>(
				cached.map((avatar) => [avatar.teamId, avatar.png ?? undefined]),
			);

			const missingFromCache = difference<TeamNumberSchema>(teamNumbers, avatars.keys());

			if (missingFromCache.size > 0) {
				await Sentry.startSpan({ name: 'Get many avatars from TBA and cache in DB', op: 'function' }, async () => {
					const tbaAvatars = await Promise.all(
						Array.from(missingFromCache).map(async (teamNumber) => ({
							teamNumber: teamNumber,
							png: await this.tba.getTeamAvatarForThisYear(teamNumber),
						})),
					);

					if (tbaAvatars.length > 0) {
						await this.db.transaction(async (tx) => {
							await tx
								.insert(Schema.teams)
								.values(tbaAvatars.map(({ teamNumber }) => ({ id: teamNumber })))
								.onConflictDoNothing();

							await tx
								.insert(Schema.avatars)
								.values(tbaAvatars.map(({ teamNumber, png }) => ({ teamId: teamNumber, png: png ?? null })))
								.onConflictDoUpdate({
									target: Schema.avatars.teamId,
									set: { png: sql`EXCLUDED.png`, createdAt: new Date() },
								});
						});
					}

					for (const { teamNumber, png } of tbaAvatars) {
						avatars.set(teamNumber, png);
					}
				});
			}

			return avatars;
		});
	}
}

export const avatarsService = new AvatarsService(tbaService, db);
