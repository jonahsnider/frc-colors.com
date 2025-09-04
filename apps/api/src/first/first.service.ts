import ky from 'ky';
import { configService } from '../config/config.service';
import type { TeamNumber } from '../teams/dtos/team-number.dto';
import { FetchTeamsWorker } from './fetch-teams.worker';
import { FetchTeamsPagesWorker } from './fetch-teams-pages.worker';
import type { FrcTeamListings } from './interfaces/frc-team-listings.interface';

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

	private readonly fetchTeamsPagesWorker = new FetchTeamsPagesWorker();
	private readonly fetchTeamsWorker = new FetchTeamsWorker();

	constructor() {
		this.fetchTeamsPagesWorker.noop();
		this.fetchTeamsWorker.noop();
	}

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

	init(): void {
		// This doesn't actually do anything, it's just necessary to ensure this file is loaded & the workers get started
	}
}

export const firstService = new FirstService();
