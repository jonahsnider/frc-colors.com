import { BaseWorker } from '../queues/base.worker';
import { fetchTeamsQueue, sweepAvatarsQueue } from '../queues/queues';
import { firstService } from './first.service';
import { DataType, JobType, NameType, ReturnType } from './interfaces/fetch-teams-queue.interface';

export class FetchTeamsWorker extends BaseWorker<DataType, ReturnType, NameType> {
	protected override async process(job: JobType): Promise<ReturnType> {
		const { page } = job.data;

		const teamNumbers = await firstService.getTeamNumbersForPage(page);

		// Schedule avatar sweep for those teams
		await sweepAvatarsQueue.add(`sweep-avatars:${page}`, { teams: teamNumbers });
	}

	constructor() {
		super(fetchTeamsQueue, {
			// Low concurrency since this hits FIRST
			concurrency: 5,
		});
	}
}
