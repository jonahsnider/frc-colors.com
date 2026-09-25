import ky, { HTTPError } from 'ky';
import pLimit from 'p-limit';
import type { TeamNumber } from '../dtos/team-number.dto.ts';

class AvatarService {
	private readonly fetcher = ky.create({ prefix: 'https://avatars.frc.sh' });
	private readonly fetchLimit = pLimit(10);

	async getAvatar(teamNumber: TeamNumber): Promise<Buffer | undefined> {
		return this.fetchLimit(async () => {
			try {
				const response = await this.fetcher.get(`teams/${teamNumber}.png`);
				return Buffer.from(await response.arrayBuffer());
			} catch (error) {
				if (error instanceof HTTPError && error.response.status === 404) {
					return undefined;
				}

				throw error;
			}
		});
	}

	async getAvatars(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, Buffer | undefined>> {
		console.log('getting avatars for', teamNumbers);
		return new Map(
			await Promise.all(teamNumbers.map(async (teamNumber) => [teamNumber, await this.getAvatar(teamNumber)] as const)),
		);
	}
}

export const avatarService = new AvatarService();
