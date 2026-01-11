import type { Job, Queue } from 'bullmq';
import type { TeamNumber } from '../../dtos/team-number.dto';

export type DataType = {
	teams: TeamNumber[];
};

export type ReturnType = undefined;

export type NameType = `sweep-avatars:${number}`;

export type QueueType = Queue<DataType, ReturnType, NameType>;

export type JobType = Job<DataType, ReturnType, NameType>;
