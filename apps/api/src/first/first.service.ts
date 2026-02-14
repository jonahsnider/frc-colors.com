import ky from 'ky';
import { configService } from '../config/config.service.ts';
import type { TeamNumber } from '../teams/dtos/team-number.dto.ts';
import type { FrcTeamListings } from './interfaces/frc-team-listings.interface.ts';

class FirstService {
	private static readonly BASIC_AUTH_TOKEN = Buffer.from(
		`${configService.frcEventsApi.username}:${configService.frcEventsApi.password}`,
		'utf8',
	).toString('base64');

	private readonly http = ky.extend({
		headers: {
			authorization: `Basic ${FirstService.BASIC_AUTH_TOKEN}`,
		},
		prefixUrl: 'https://frc-api.firstinspires.org/v3.0',
	});

	async *getTeamNumbers(): AsyncGenerator<TeamNumber> {
		let page = 1;
		let pageTotal: number;

		do {
			const response = await this.http.get(`${new Date().getFullYear()}/teams`, {
				searchParams: {
					page,
				},
			});
			const body = await response.json<FrcTeamListings>();

			pageTotal = body.pageTotal;

			yield* body.teams.map((team) => team.teamNumber);

			page = body.pageCurrent + 1;
		} while (page <= pageTotal);
	}
}

export const firstService = new FirstService();
