import { Cron } from 'croner';
import { baseLogger } from '../logger/logger';
import { refreshAllTeamColors } from '../pipeline/refresh-pipeline';

class CacheManager {
	private readonly logger = baseLogger.child({ module: 'cache manager' });

	init(): void {
		// Schedule hourly refresh
		new Cron('0 * * * *', () => {
			refreshAllTeamColors();
		});

		// Run immediately on startup
		refreshAllTeamColors();

		this.logger.info('Cache refresh scheduled');
	}
}

export const cacheManager = new CacheManager();
