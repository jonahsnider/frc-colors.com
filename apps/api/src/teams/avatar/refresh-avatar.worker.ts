import { BaseWorker } from '../../queues/base.worker';
import { ms } from 'convert';
import { extractColorsQueue, refreshAvatarQueue } from '../../queues/queues';
import { avatarService } from './avatar.service';
import { DataType, JobType, NameType, ReturnType } from './interfaces/refresh-avatar-queue.interface';

export class RefreshAvatarWorker extends BaseWorker<DataType, ReturnType, NameType> {
	protected override async process(job: JobType): Promise<ReturnType> {
		const { team } = job.data;

		await avatarService.refreshAvatar(team);

		// Schedule colors to be extracted for the new avatar
		await extractColorsQueue.add(`extract-and-store-colors:${team}`, { team });
	}

	constructor() {
		super(refreshAvatarQueue, {
			// Low concurrency since this hits TBA
			concurrency: 10,
			limiter: {
				duration: ms('15s'),
				max: 15,
			},
		});
	}
}
