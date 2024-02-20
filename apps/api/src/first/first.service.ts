import ky from 'ky';
import { configService } from '../config/config.service';
import { baseLogger } from '../logger/logger';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { FetchTeamsPagesWorker } from './fetch-teams-pages.worker';
import { FetchTeamsWorker } from './fetch-teams.worker';
import { FrcTeamListings } from './interfaces/frc-team-listings.interface';

export class FirstService {
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

	private readonly logger = baseLogger.child({ module: 'first' });

	private readonly fetchTeamsPagesWorker = new FetchTeamsPagesWorker();
	private readonly fetchTeamsWorker = new FetchTeamsWorker();

	async getPageCount(): Promise<number> {
		const response = await this.http.get(`${new Date().getFullYear()}/teams?page=1`);

		const body = await response.json<FrcTeamListings>();

		return body.pageTotal;
	}

	async getTeamNumbersForPage(page: number): Promise<TeamNumber[]> {
		const response = await this.http.get(`${new Date().getFullYear()}/teams?page=${page}`);

		const body = await response.json<FrcTeamListings>();

		return body.teams.map((team) => team.teamNumber);
	}
}

export const firstService = new FirstService();
