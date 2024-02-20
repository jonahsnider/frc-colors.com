import { BaseWorker } from '../queues/base.worker';
import { extractColorsQueue } from '../queues/queues';
import { colorsService } from './colors.service';
import { DataType, JobType, NameType, ReturnType } from './interfaces/queue.interface';

export class ColorsWorker extends BaseWorker<DataType, ReturnType, NameType> {
	protected override async process(job: JobType): Promise<ReturnType> {
		const { team } = job.data;

		const colors = await colorsService.generated.getTeamColors(team);

		if (colors) {
			await colorsService.stored.setTeamColors(team, colors);
		} else {
			await colorsService.stored.deleteTeamColors(team);
		}

		return undefined;
	}

	constructor() {
		super(extractColorsQueue, {
			// Extracting colors is actually a kinda computationally expensive process, it takes a few seconds to do a batch of 100
			concurrency: 100,
		});
	}
}
