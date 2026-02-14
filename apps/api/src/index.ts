import * as Sentry from '@sentry/node';
import { apiService } from './api/api.service.ts';
import { cacheManager } from './cache-manager/cache-manager.service.ts';
import { configService } from './config/config.service.ts';

Sentry.init({
	dsn: configService.sentryDsn,
	tracesSampleRate: 1.0,
	environment: configService.nodeEnv,
});

apiService.initServer();

cacheManager.init();

export type { AppRouter } from './trpc/app.router.ts';
