import { Job, Queue, Worker } from 'bullmq';

export type DataType = undefined;

export type ReturnType = undefined;

export type NameType = 'fetch-teams-pages';

export type QueueType = Queue<DataType, ReturnType, NameType>;

export type JobType = Job<DataType, ReturnType, NameType>;

export type WorkerType = Worker<DataType, ReturnType, NameType>;
