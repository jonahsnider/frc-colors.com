import * as Sentry from '@sentry/bun';
import { apiService } from './api/api.service';
import { cacheManager } from './cache-manager/cache-manager.service';
import { configService } from './config/config.service';

Sentry.init({
	dsn: configService.sentryDsn,
	tracesSampleRate: 1.0,
	environment: configService.nodeEnv,
});

apiService.initServer();

cacheManager.init();

export type { AppRouter } from './trpc/app.router';
