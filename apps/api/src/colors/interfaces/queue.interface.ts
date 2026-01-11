import type { Job, Queue } from 'bullmq';
import type { TeamNumber } from '../../teams/dtos/team-number.dto';

export type DataType = {
	team: TeamNumber;
};

export type ReturnType = undefined;

export type NameType = `extract-and-store-colors:${TeamNumber}`;

export type QueueType = Queue<DataType, ReturnType, NameType>;

export type JobType = Job<DataType, ReturnType, NameType>;
