import { Job, Queue } from 'bullmq';
import { TeamNumber } from '../../dtos/team-number.dto';

export type DataType = {
	team: TeamNumber;
};

export type ReturnType = undefined;

export type NameType = `refresh-avatar:${TeamNumber}`;

export type QueueType = Queue<DataType, ReturnType, NameType>;

export type JobType = Job<DataType, ReturnType, NameType>;
