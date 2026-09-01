import { TRPCError } from '@trpc/server';
import ky, { HTTPError, type KyResponse } from 'ky';
import { configService } from '../config/config.service.ts';
import { baseLogger } from '../logger/logger.ts';
import { TeamNumber } from '../teams/dtos/team-number.dto.ts';
import { trackDuration } from '../timing/timing.ts';
import type { TbaEventTeams } from './interfaces/tba-event-teams.interface.ts';
import type { TbaTeam } from './interfaces/tba-team.interface.ts';

/** API client for fetching team data from TBA. */
class TbaService {
	private readonly fetcher = ky.extend({
		prefix: 'https://www.thebluealliance.com/api/v3',
		headers: {
			'X-TBA-Auth-Key': configService.tbaApiKey,
		},
	});

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
