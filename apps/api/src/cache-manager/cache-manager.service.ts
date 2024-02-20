import convert from 'convert';
import { baseLogger } from '../logger/logger';
import { fetchTeamsPagesQueue } from '../queues/queues';

export class CacheManager {
	private static readonly CACHE_SWEEP_INTERVAL = convert(1, 'day');

	// biome-ignore lint/correctness/noUndeclaredVariables: Global type from Bun
	private timer: Timer | undefined;
	private readonly logger = baseLogger.child({ module: 'cache manager' });

	init() {
		if (this.timer) {
			throw new Error('CacheManager already initialized');
		}

		this.timer = setInterval(this.refresh.bind(this), CacheManager.CACHE_SWEEP_INTERVAL.to('ms'));
	}

	async refresh(): Promise<void> {
		this.logger.info('Scheduling cache refresh');

		await fetchTeamsPagesQueue.drain();

		await fetchTeamsPagesQueue.add('fetch-teams-pages', undefined);

		this.logger.info('Cache refresh scheduled');
	}
}

export const cacheManager = new CacheManager();
