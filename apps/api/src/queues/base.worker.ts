import { captureException } from '@sentry/bun';
import { type Job, type Queue, Worker, type WorkerOptions } from 'bullmq';
import { baseLogger } from '../logger/logger';
import { workerRedisConnection } from '../redis/redis';

export abstract class BaseWorker<DataType, ReturnType, NameType extends string> {
	protected readonly worker: Worker<DataType, ReturnType, NameType>;
	protected readonly logger = baseLogger.child({ module: this.constructor.name });

	protected constructor(
		queue: Queue<DataType, ReturnType, NameType>,
		options?: Omit<WorkerOptions, 'connection'> & Partial<Pick<WorkerOptions, 'connection'>>,
	) {
		this.worker = new Worker(queue.name, this.process.bind(this), {
			connection: workerRedisConnection,
			...options,
		});

		this.worker.on('error', (error) => {
			captureException(error);
			this.logger.error(error, 'Worker error');
		});
	}

	protected abstract process(job: Job<DataType, ReturnType, NameType>): Promise<ReturnType>;
}
