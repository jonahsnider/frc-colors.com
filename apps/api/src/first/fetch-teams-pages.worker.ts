import { BaseWorker } from '../queues/base.worker';
import { fetchTeamsPagesQueue, fetchTeamsQueue } from '../queues/queues';
import { firstService } from './first.service';
import { DataType, NameType, ReturnType } from './interfaces/fetch-teams-pages-queue.interface';
import * as FetchTeamsQueue from './interfaces/fetch-teams-queue.interface';
import { ms } from 'convert';

export class FetchTeamsPagesWorker extends BaseWorker<DataType, ReturnType, NameType> {
	protected override async process(): Promise<ReturnType> {
		const pages = await firstService.getPageCount();

		const jobs: Array<{ name: FetchTeamsQueue.NameType; data: FetchTeamsQueue.DataType }> = [];

		for (let i = 1; i <= pages; i++) {
			jobs.push({
				name: `fetch-teams:${i}`,
				data: { page: i },
			});
		}

		// Schedule fetches for all pages
		await fetchTeamsQueue.addBulk(jobs);
	}

	constructor() {
		super(fetchTeamsPagesQueue, {
			// Low concurrency since this hits FIRST
			// Although, this shouldn't ever really be scheduled more than once at a time
			concurrency: 5,
			limiter: {
				duration: ms('5s'),
				max: 5,
			},
		});
	}
}
