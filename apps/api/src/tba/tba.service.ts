import { Buffer } from 'node:buffer';

import { TRPCError } from '@trpc/server';
import ky, { HTTPError, KyResponse } from 'ky';
import { configService } from '../config/config.service';
import { baseLogger } from '../logger/logger';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { trackDuration } from '../timing/timing';
import { TbaEventTeams } from './interfaces/tba-event-teams.interface';
import { TbaMediaAvatar } from './interfaces/tba-media.interface';
import { TbaTeamMediaForYear } from './interfaces/tba-team-media-for-year.interface';
import { TbaTeam } from './interfaces/tba-team.interface';

/** API client for fetching team data from TBA. */
export class TbaService {
	private readonly fetcher = ky.extend({
		prefixUrl: 'https://www.thebluealliance.com/api/v3',
		headers: {
			'X-TBA-Auth-Key': configService.tbaApiKey,
		},
	});

	/** Get a buffer with a PNG of the team's avatar for the current year. */
	async getTeamAvatarForThisYear(teamNumber: TeamNumber): Promise<Buffer | undefined> {
		const currentYear = new Date().getFullYear();
		const yearsToCheck = [currentYear, currentYear - 1];

		for (const year of yearsToCheck) {
			const colors = await this.getTeamAvatarForYear(teamNumber, year);

			if (colors) {
				return colors;
			}
		}

		return undefined;
	}

	async getTeamName(teamNumber: TeamNumber): Promise<string | undefined> {
		const team = await this.getTeamRaw(teamNumber);

		if (!team) {
			return undefined;
		}

		return team?.nickname ?? team?.name;
	}

	async getTeamsForEvent(eventCode: string): Promise<TeamNumber[]> {
		const eventTeams = await trackDuration('tba', 'teams for event', this.getEventRaw(eventCode));

		return TeamNumber.array().parse(eventTeams.map((team) => team.team_number));
	}

	/** Get a buffer with a PNG of the team's avatar for the given year. */
	private async getTeamAvatarForYear(teamNumber: TeamNumber, year: number): Promise<Buffer | undefined> {
		const teamMedia = await this.getTeamMediaForYearRaw(teamNumber, year);

		const avatarMedia = teamMedia.find((media): media is TbaMediaAvatar => media.type === 'avatar');

		if (!avatarMedia?.details?.base64Image) {
			return undefined;
		}

		return Buffer.from(avatarMedia.details.base64Image, 'base64');
	}

	/** Get a team's media for a given year. */
	private async getTeamMediaForYearRaw(teamNumber: TeamNumber, year: number): Promise<TbaTeamMediaForYear> {
		try {
			const response = await this.fetcher.get(`team/frc${teamNumber}/media/${year}`);
			const body = await response.json<TbaTeamMediaForYear>();

			if (!Array.isArray(body)) {
				baseLogger.warn('TBA returned non-array response for team media:');
				console.warn({ response });
				return [];
			}

			return body;
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 404) {
				return [];
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Error fetching team media from TBA.',
			});
		}
	}

	private async getTeamRaw(teamNumber: TeamNumber): Promise<TbaTeam | undefined> {
		try {
			const response = await this.fetcher.get(`team/frc${teamNumber}`);

			const body = await response.json<TbaTeam>();

			if (typeof body !== 'object') {
				baseLogger.warn('TBA returned non-object response for team:');
				console.warn({ response });
				return undefined;
			}

			return body;
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 404) {
				return undefined;
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Error fetching team from TBA.',
				cause: error,
			});
		}
	}

	private async getEventRaw(eventCode: string): Promise<TbaEventTeams> {
		let response: KyResponse;

		try {
			response = await this.fetcher.get(`event/${encodeURIComponent(eventCode)}/teams`);
		} catch (error) {
			if (error instanceof HTTPError && error.response.status === 404) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: `Event ${eventCode} not found on TBA.`,
				});
			}

			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: 'Error fetching event from TBA.',
				cause: error,
			});
		}

		return response.json<TbaEventTeams>();
	}
}

export const tbaService = new TbaService();
