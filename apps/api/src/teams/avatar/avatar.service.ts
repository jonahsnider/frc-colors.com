import { difference } from '@jonahsnider/util';
import { convert } from 'convert';
import { eq, inArray } from 'drizzle-orm';
import { db } from '../../db/db.ts';
import { Schema } from '../../db/index.ts';
import { tbaService } from '../../tba/tba.service.ts';
import type { TeamNumber } from '../dtos/team-number.dto.ts';

class AvatarService {
	private static readonly AVATAR_TTL = convert(1, 'day');

	async getAvatar(teamNumber: TeamNumber): Promise<Buffer | undefined> {
		const cached = await db.query.avatars.findFirst({
			where: eq(Schema.avatars.team, teamNumber),
		});

		return cached?.png ?? undefined;
	}

	async getAvatars(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, Buffer | undefined>> {
		if (teamNumbers.length === 0) {
			return new Map();
		}

		const cached = await db.query.avatars.findMany({
			where: inArray(Schema.avatars.team, teamNumbers),
			columns: {
				png: true,
				team: true,
			},
		});

		return new Map(cached.map((avatar) => [avatar.team, avatar.png ?? undefined]));
	}

	async refreshAvatar(team: TeamNumber): Promise<void> {
		const avatar = await tbaService.getTeamAvatarForThisYear(team);

		await this.storeAvatar(team, avatar);
	}

	async shouldRefresh(teams: TeamNumber[]): Promise<TeamNumber[]> {
		if (teams.length === 0) {
			return [];
		}

		const cached = await db.query.avatars.findMany({
			where: inArray(Schema.avatars.team, teams),
			columns: {
				team: true,
				createdAt: true,
			},
		});
		const expiredTeams = cached
			.filter((row) => row.createdAt < new Date(Date.now() - AvatarService.AVATAR_TTL.to('ms')))
			.map((row) => row.team);

		const missing = difference(
			teams,
			cached.map((row) => row.team),
		);

		return [...expiredTeams, ...missing];
	}

	private async storeAvatar(team: number, avatar: Buffer | undefined) {
		await db.transaction(async (tx) => {
			await tx.insert(Schema.teams).values({ number: team }).onConflictDoNothing();
			await tx
				.insert(Schema.avatars)
				.values({ team: team, createdAt: new Date(), png: avatar ?? null })
				.onConflictDoUpdate({
					target: Schema.avatars.team,
					set: { createdAt: new Date(), png: avatar ?? null },
				});
		});
	}
}

export const avatarService = new AvatarService();
