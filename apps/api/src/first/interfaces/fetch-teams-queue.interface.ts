import type { Job, Queue } from 'bullmq';

export type DataType = {
	page: number;
};

export type ReturnType = undefined;

export type NameType = `fetch-teams:${number}`;

export type QueueType = Queue<DataType, ReturnType, NameType>;

export type JobType = Job<DataType, ReturnType, NameType>;
