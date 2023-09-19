import * as Sentry from '@sentry/nextjs';
import convert from 'convert';
import { ConfigService, configService } from '../config/config.service';
import { TeamNumberSchema } from '../teams/dtos/team-number.dto';
import { UnknownEventException } from './exceptions/unknown-event.exception';
import { TbaEventTeams } from './interfaces/tba-event-teams.interface';
import { TbaMediaAvatar } from './interfaces/tba-media.interface';
import { TbaTeamMediaForYear } from './interfaces/tba-team-media-for-year.interface';
import { TbaTeam } from './interfaces/tba-team.interface';

/** API client for fetching team data from TBA. */
export class TbaService {
	private static readonly BASE_API_URL = 'https://www.thebluealliance.com/api/v3';

	/** Duration to cache response for team media for year. */
	private static readonly TEAM_MEDIA_FOR_YEAR_CACHE_DURATION = convert(1, 'week');

	/** Duration to cache response for team. */
	private static readonly TEAM_CACHE_DURATION = convert(1, 'week');

	/** Duration to cache response for event teams. */
	private static readonly EVENT_TEAMS_CACHE_DURATION = convert(1, 'week');

	constructor(private readonly config: ConfigService) {}

	/** Get a buffer with a PNG of the team's avatar for the current year. */
	async getTeamAvatarForThisYear(teamNumber: TeamNumberSchema): Promise<Buffer | undefined> {
		return Sentry.startSpan({ name: 'Get team avatar for this year from TBA', op: 'function' }, async () => {
			const currentYear = new Date().getFullYear();
			const yearsToCheck = [currentYear, currentYear - 1];

			for (const year of yearsToCheck) {
				const colors = await this.getTeamAvatarForYear(teamNumber, year);

				if (colors) {
					return colors;
				}
			}
		});
	}

	async getTeamName(teamNumber: TeamNumberSchema): Promise<string | undefined> {
		return Sentry.startSpan({ name: 'Get team name from TBA', op: 'function' }, async () => {
			const team = await this.getTeamRaw(teamNumber);

			if (!team) {
				return undefined;
			}

			return team?.nickname ?? team?.name;
		});
	}

	async getTeamsForEvent(eventCode: string): Promise<TeamNumberSchema[]> {
		return Sentry.startSpan({ name: 'Get teams for event from TBA', op: 'function' }, async () => {
			const eventTeams = await this.getEventRaw(eventCode);

			return TeamNumberSchema.array().parse(eventTeams.map((team) => team.team_number));
		});
	}

	/** Get a buffer with a PNG of the team's avatar for the given year. */
	private async getTeamAvatarForYear(teamNumber: TeamNumberSchema, year: number): Promise<Buffer | undefined> {
		const teamMedia = await this.getTeamMediaForYearRaw(teamNumber, year);

		const avatarMedia = teamMedia.find((media): media is TbaMediaAvatar => media.type === 'avatar');

		if (!avatarMedia?.details?.base64Image) {
			return undefined;
		}

		return Buffer.from(avatarMedia.details.base64Image, 'base64');
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

		if (response.status === 404) {
			return [];
		}

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

	private async getEventRaw(eventCode: string): Promise<TbaEventTeams> {
		if (!this.config.tbaApiKey) {
			return [];
		}

		const response = await fetch(`${TbaService.BASE_API_URL}/event/${encodeURIComponent(eventCode)}/teams`, {
			headers: {
				'X-TBA-Auth-Key': this.config.tbaApiKey,
			},
			next: {
				revalidate: TbaService.EVENT_TEAMS_CACHE_DURATION.to('seconds'),
			},
		});

		if (response.status === 404) {
			throw new UnknownEventException(eventCode);
		}

		if (!response.ok) {
			throw new Error(`Failed to fetch teams for event ${eventCode} from TBA: ${await response.text()}`);
		}

		return response.json();
	}
}

export const tbaService = new TbaService(configService);
