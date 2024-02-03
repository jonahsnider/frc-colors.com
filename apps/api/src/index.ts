import * as Sentry from '@sentry/bun';
import { App } from '@tinyhttp/app';
import { logger as loggerMiddleware } from '@tinyhttp/logger';
import cors from 'cors';
import { listen } from 'listhen';
import { errorHandler } from './api/error-handler';
import { Controllers } from './api/index';
import { cacheManager } from './cache-manager/cache-manager.service';
import { configService } from './config/config.service';
import { logger } from './logger/logger';

Sentry.init({
	dsn: configService.sentryDsn,
	tracesSampleRate: 1.0,
});

const server = new App({
	onError: errorHandler,
})
	.use(loggerMiddleware())
	.use(cors());

for (const registerController of Object.values(Controllers)) {
	registerController(server);
}

// biome-ignore lint/suspicious/noExplicitAny: This is safe
const listener = await listen(server.attach as any, {
	port: configService.port,
	qr: false,
	// biome-ignore lint/style/useNamingConvention: This is a library
	showURL: false,
});

for (const url of await listener.getURLs()) {
	logger.withTag('server').success(`Listening on ${url.url}`);
}

cacheManager.init();
// Initial refresh on boot, but only if not in development (hot reload reruns this too often)
if (configService.nodeEnv !== 'development') {
	await cacheManager.refresh();
}

export { type AppRouter } from './trpc/app.router';
