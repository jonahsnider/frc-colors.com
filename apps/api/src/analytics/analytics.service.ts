import { PostHog } from 'posthog-node';
import { configService } from '../config/config.service';

class AnalyticsService {
	public readonly client = new PostHog(configService.posthogApiKey, {
		host: 'https://app.posthog.com',
	});
}

export const analyticsService = new AnalyticsService();
