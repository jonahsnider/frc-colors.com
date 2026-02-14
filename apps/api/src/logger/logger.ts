import pino from 'pino';
import { configService } from '../config/config.service.ts';

export const baseLogger = pino({
	level: 'trace',
	transport:
		configService.nodeEnv === 'development'
			? {
					target: 'pino-pretty',
				}
			: undefined,
});
