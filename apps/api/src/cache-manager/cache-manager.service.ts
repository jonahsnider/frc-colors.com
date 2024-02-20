import convert from 'convert';
import { baseLogger } from '../logger/logger';
import { fetchTeamsPagesQueue } from '../queues/queues';

export class CacheManager {
	private static readonly CACHE_REFRESH_INTERVAL = convert(1, 'hour');

	private readonly logger = baseLogger.child({ module: 'cache manager' });

	async init(): Promise<void> {
		await fetchTeamsPagesQueue.add('fetch-teams-pages', undefined, {
			repeat: {
				every: CacheManager.CACHE_REFRESH_INTERVAL.to('ms'),
			},
		});
		this.logger.info(`Cache refresh scheduled to repeat every ${CacheManager.CACHE_REFRESH_INTERVAL.to('best')}`);
	}
}

export const cacheManager = new CacheManager();
