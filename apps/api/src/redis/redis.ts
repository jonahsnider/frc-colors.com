import Ioredis from 'ioredis';
import { configService } from '../config/config.service';

export const queueRedisConnection = new Ioredis(configService.redisUrl);

export const workerRedisConnection = new Ioredis(configService.redisUrl, {
	offlineQueue: false,
	maxRetriesPerRequest: null,
});
