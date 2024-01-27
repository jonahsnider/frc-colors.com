import { App } from '@tinyhttp/app';

import { logger as loggerMiddleware } from '@tinyhttp/logger';
import cors from 'cors';
import { errorHandler } from './api/error-handler';
import { Controllers } from './api/index';
import { cacheManager } from './cache-manager/cache-manager.service';
import { configService } from './config/config.service';
import { logger } from './logger/logger';

const port = Number(process.env['PORT'] ?? 3000);

const server = new App({
	onError: errorHandler,
})
	.use(loggerMiddleware())
	.use(cors());

for (const registerController of Object.values(Controllers)) {
	registerController(server);
}

server.listen(port);

logger.withTag('server').success(`Listening on port ${port}`);

cacheManager.init();
// Initial refresh on boot, but only if not in development (hot reload reruns this too often)
if (configService.nodeEnv !== 'development') {
	await cacheManager.refresh();
}

export { type AppRouter } from './trpc/app.router';
