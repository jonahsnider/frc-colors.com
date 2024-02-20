import { Queue, QueueOptions } from 'bullmq';
import convert from 'convert';
import * as extractColors from '../colors/interfaces/queue.interface';
import * as fetchTeamsPages from '../first/interfaces/fetch-teams-pages-queue.interface';
import * as fetchTeams from '../first/interfaces/fetch-teams-queue.interface';
import { queueRedisConnection } from '../redis/redis';
import * as refreshAvatar from '../teams/avatar/interfaces/refresh-avatar-queue.interface';
import * as sweepAvatars from '../teams/avatar/interfaces/sweep-avatars-queue.interface';

export enum QueueNames {
	/** Query FIRST to determine how many pages of teams exist, and then schedule fetch operations for those teams. */
	FetchTeamsPages = 'FetchTeamsPages',
	/** Given a page number for the FIRST API, fetch the team numbers from that page, and schedule avatar refreshes for them. */
	FetchTeams = 'FetchTeams',
	/** Given a list of teams, see if their avatars are missing from our DB, or are expired. Schedule refresh jobs for them if needed. */
	SweepAvatars = 'SweepAvatars',
	/** Given a team number, fetch its avatar from TBA and store it in the DB. Schedule a job to extract the colors, since the avatar may have changed. */
	RefreshAvatar = 'RefreshAvatar',
	/** Given a team number, extract the colors from the avatar and store them in the DB. */
	ExtractAndStoreColors = 'ExtractAndStoreColors',
}

const BASE_QUEUE_OPTIONS = {
	connection: queueRedisConnection,
} as const satisfies QueueOptions;

export const fetchTeamsPagesQueue: fetchTeamsPages.QueueType = new Queue(QueueNames.FetchTeamsPages, {
	...BASE_QUEUE_OPTIONS,
	defaultJobOptions: {
		removeOnComplete: { age: convert(5, 'minutes').to('seconds'), count: 100 },
		removeOnFail: { age: convert(1, 'hour').to('seconds') },
	},
});
export const fetchTeamsQueue: fetchTeams.QueueType = new Queue(QueueNames.FetchTeams, {
	...BASE_QUEUE_OPTIONS,
	defaultJobOptions: {
		removeOnComplete: { age: convert(5, 'minutes').to('seconds'), count: 100 },
		removeOnFail: { age: convert(1, 'hour').to('seconds') },
	},
});
export const sweepAvatarsQueue: sweepAvatars.QueueType = new Queue(QueueNames.SweepAvatars, {
	...BASE_QUEUE_OPTIONS,
	defaultJobOptions: {
		removeOnComplete: { age: convert(5, 'minutes').to('seconds'), count: 100 },
		removeOnFail: { age: convert(1, 'hour').to('seconds') },
	},
});
export const refreshAvatarQueue: refreshAvatar.QueueType = new Queue(QueueNames.RefreshAvatar, {
	...BASE_QUEUE_OPTIONS,
	defaultJobOptions: {
		removeOnComplete: { age: convert(5, 'minutes').to('seconds'), count: 5000 },
		removeOnFail: { age: convert(1, 'hour').to('seconds') },
	},
});
export const extractColorsQueue: extractColors.QueueType = new Queue(QueueNames.ExtractAndStoreColors, {
	...BASE_QUEUE_OPTIONS,
	defaultJobOptions: {
		removeOnComplete: { age: convert(5, 'minutes').to('seconds'), count: 5000 },
		removeOnFail: { age: convert(1, 'hour').to('seconds') },
	},
});

export const ALL_QUEUES = [
	fetchTeamsPagesQueue,
	fetchTeamsQueue,
	sweepAvatarsQueue,
	refreshAvatarQueue,
	extractColorsQueue,
];
