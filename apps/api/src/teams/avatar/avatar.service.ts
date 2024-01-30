import { eq, inArray } from 'drizzle-orm';
import { db } from '../../db/db';
import { Schema } from '../../db/index';
import { TeamNumber } from '../dtos/team-number.dto';

export class AvatarService {
	async getAvatar(teamNumber: TeamNumber): Promise<Buffer | undefined> {
		const cached = await db.query.avatars.findFirst({
			where: eq(Schema.avatars.team, teamNumber),
		});

		return cached?.png ?? undefined;
	}

	async getAvatars(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, Buffer | undefined>> {
		const cached =
			teamNumbers.length > 0
				? await db.query.avatars.findMany({
						where: inArray(Schema.avatars.team, teamNumbers),
						columns: {
							png: true,
							team: true,
						},
				  })
				: [];

		return new Map(cached.map((avatar) => [avatar.team, avatar.png ?? undefined]));
	}
}

export const avatarService = new AvatarService();
