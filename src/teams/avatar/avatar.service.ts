import { HttpError, pipeline, withBaseUrl, withHttpError, withRetry, withTimeout } from 'fetch-extras';
import type { TeamNumber } from '../dtos/team-number.dto.ts';

class AvatarService {
	private readonly fetcher = pipeline(
		fetch,
		withTimeout(10_000),
		withBaseUrl('https://avatars.frc.sh'),
		withRetry(),
		withHttpError(),
	);

	async getAvatar(teamNumber: TeamNumber): Promise<Buffer | undefined> {
		try {
			const response = await this.fetcher(`teams/${teamNumber}.png`);
			return Buffer.from(await response.arrayBuffer());
		} catch (error) {
			if (error instanceof HttpError && error.response.status === 404) {
				return undefined;
			}

			throw error;
		}
	}

	async getAvatars(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, Buffer | undefined>> {
		return new Map(
			await Promise.all(teamNumbers.map(async (teamNumber) => [teamNumber, await this.getAvatar(teamNumber)] as const)),
		);
	}
}

export const avatarService = new AvatarService();
