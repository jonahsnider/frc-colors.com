import { Job, Queue, Worker, WorkerOptions } from 'bullmq';
import { workerRedisConnection } from '../redis/redis';

export abstract class BaseWorker<DataType, ReturnType, NameType extends string> {
	protected readonly worker: Worker<DataType, ReturnType, NameType>;

	protected constructor(
		queue: Queue<DataType, ReturnType, NameType>,
		options?: Omit<WorkerOptions, 'connection'> & Partial<Pick<WorkerOptions, 'connection'>>,
	) {
		this.worker = new Worker(queue.name, this.process.bind(this), {
			connection: workerRedisConnection,
			...options,
		});
	}

	protected abstract process(job: Job<DataType, ReturnType, NameType>): Promise<ReturnType>;
}
