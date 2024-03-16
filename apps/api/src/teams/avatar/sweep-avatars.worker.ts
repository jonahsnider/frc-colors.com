import { BaseWorker } from '../../queues/base.worker';
import { refreshAvatarQueue, sweepAvatarsQueue } from '../../queues/queues';
import { avatarService } from './avatar.service';
import type { DataType, JobType, NameType, ReturnType } from './interfaces/sweep-avatars-queue.interface';

export class SweepAvatarsWorker extends BaseWorker<DataType, ReturnType, NameType> {
	protected override async process(job: JobType): Promise<ReturnType> {
		const { teams } = job.data;

		const shouldRefresh = await avatarService.shouldRefresh(teams);

		// Schedule avatar extraction
		await refreshAvatarQueue.addBulk(
			shouldRefresh.map((team) => ({
				name: `refresh-avatar:${team}`,
				data: { team },
			})),
		);
	}

	constructor() {
		super(sweepAvatarsQueue, { concurrency: 100 });
	}
}
