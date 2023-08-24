import convert from 'convert';
import { ConfigService, configService } from '../config/config.service';
import { TeamNumberSchema } from '../teams/dtos/team-number.dto';
import { TbaMediaAvatar } from './interfaces/tba-media.interface';
import { TbaTeamMediaForYear } from './interfaces/tba-team-media-for-year.interface';
import { TbaTeam } from './interfaces/tba-team.interface';

/** API client for fetching team data from TBA. */
export class TbaService {
	private static readonly BASE_API_URL = 'https://www.thebluealliance.com/api/v3';

	/** Duration to cache response for team media for year. */
	private static readonly TEAM_MEDIA_FOR_YEAR_CACHE_DURATION = convert(1, 'day');

	/** Duration to cache response for team. */
	private static readonly TEAM_CACHE_DURATION = convert(1, 'day');

	constructor(private readonly config: ConfigService) {}

	/** Get a buffer with a PNG of the team's avatar for the given year. */
	async getTeamAvatarForYear(teamNumber: TeamNumberSchema, year: number): Promise<Buffer | undefined> {
		const teamMedia = await this.getTeamMediaForYearRaw(teamNumber, year);

		const avatarMedia = teamMedia.find((media): media is TbaMediaAvatar => media.type === 'avatar');

		if (!avatarMedia?.details?.base64Image) {
			return undefined;
		}

		return Buffer.from(avatarMedia.details.base64Image, 'base64');
	}

	async getTeamName(teamNumber: TeamNumberSchema): Promise<string | undefined> {
		const team = await this.getTeamRaw(teamNumber);

		if (!team) {
			return undefined;
		}

		return team?.nickname ?? team?.name;
	}

	/** Get a team's media for a given year. */
	private async getTeamMediaForYearRaw(teamNumber: TeamNumberSchema, year: number): Promise<TbaTeamMediaForYear> {
		if (!this.config.tbaApiKey) {
			return [];
		}

		const response = await fetch(`${TbaService.BASE_API_URL}/team/frc${teamNumber}/media/${year}`, {
			headers: {
				'X-TBA-Auth-Key': this.config.tbaApiKey,
			},
			next: {
				revalidate: TbaService.TEAM_MEDIA_FOR_YEAR_CACHE_DURATION.to('seconds'),
			},
		});

		if (!response.ok) {
			throw new Error(`Failed to fetch team media for team ${teamNumber} from TBA: ${await response.text()}`);
		}

		return response.json();
	}

	private async getTeamRaw(teamNumber: TeamNumberSchema): Promise<TbaTeam | undefined> {
		if (!this.config.tbaApiKey) {
			return undefined;
		}

		const response = await fetch(`${TbaService.BASE_API_URL}/team/frc${teamNumber}`, {
			headers: {
				'X-TBA-Auth-Key': this.config.tbaApiKey,
			},
			next: {
				revalidate: TbaService.TEAM_CACHE_DURATION.to('seconds'),
			},
		});

		if (response.status === 404) {
			return undefined;
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch team ${teamNumber} from TBA: ${await response.text()}`);
		}

		return response.json();
	}
}

export const tbaService = new TbaService(configService);
