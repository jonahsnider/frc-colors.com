import * as Sentry from '@sentry/bun';
import { apiService } from './api/api.service';
import { cacheManager } from './cache-manager/cache-manager.service';
import { configService } from './config/config.service';
import { firstService } from './first/first.service';

Sentry.init({
	dsn: configService.sentryDsn,
	tracesSampleRate: 1.0,
	environment: configService.nodeEnv,
});

firstService.init();

apiService.initServer();

cacheManager.init();

await cacheManager.refresh();

export { type AppRouter } from './trpc/app.router';
