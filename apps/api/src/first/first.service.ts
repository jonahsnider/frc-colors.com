import ky from 'ky';
import { configService } from '../config/config.service';
import { baseLogger } from '../logger/logger';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { FrcTeamListings } from './interfaces/frc-team-listings.interface';

export class FirstService {
	private static readonly MOCK_TEAMS: TeamNumber[] | undefined = undefined;
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

	async getAllTeamNumbers(): Promise<TeamNumber[]> {
		if (FirstService.MOCK_TEAMS && configService.nodeEnv === 'development') {
			return FirstService.MOCK_TEAMS;
		}

		const result: TeamNumber[] = [];

		let pages = 2;

		this.logger.info('Fetching all team numbers');

		for (let page = 1; page < pages; page++) {
			const response = await this.http.get(`${new Date().getFullYear()}/teams?page=${page}`);

			const body = await response.json<FrcTeamListings>();

			pages = body.pageTotal;

			result.push(...body.teams.map((team) => team.teamNumber));
			this.logger
				.child({ module: `page ${page}/${pages}` })
				.debug(`Fetched ${result.length}/${body.teamCountTotal} teams`);
		}

		this.logger.info(`Fetched ${result.length} teams`);

		return result;
	}
}

export const firstService = new FirstService();
