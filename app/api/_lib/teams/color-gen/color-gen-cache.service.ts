import * as Sentry from '@sentry/nextjs';
import { VercelKV, kv } from '@vercel/kv';
import { ConfigService, configService } from '../../config/config.service';
import { CACHE_TTL_GENERATED_COLORS } from '../../config/ttls-config';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';
import { CachedColorsSchema } from './dtos/cached-colors.dto';

export class ColorGenCacheService {
	private static readonly IGNORE_CACHE = true;

	constructor(private readonly redis: VercelKV, private readonly config: ConfigService) {}

	async setCachedTeamColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): Promise<void> {
		return Sentry.startSpan({ name: 'Set cached generated team colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Set Redis key for generated colors', op: 'db.redis' }, async () => {
				await this.redis.hset(this.generatedColorsRedisKey(teamNumber), {
					primary: colors.primary,
					secondary: colors.secondary,
				});
				await this.redis.expire(this.generatedColorsRedisKey(teamNumber), CACHE_TTL_GENERATED_COLORS.to('seconds'));
			});
		});
	}

	async delCachedTeamColors(teamNumber: TeamNumberSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Delete cached generated team colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Delete Redis key for generated colors', op: 'db.redis' }, async () => {
				await this.redis.del(this.generatedColorsRedisKey(teamNumber));
			});
		});
	}

	async getManyCachedTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, TeamColorsSchema>> {
		if (ColorGenCacheService.IGNORE_CACHE) {
			return new Map();
		}

		return Sentry.startSpan({ name: 'Get many cached generated team colors', op: 'function' }, async () => {
			const cached = (
				await Promise.all(
					teamNumbers.map(async (teamNumber) => [teamNumber, await this.getCachedTeamColors(teamNumber)] as const),
				)
			).filter((tuple): tuple is [TeamNumberSchema, TeamColorsSchema] => Boolean(tuple[1]));

			return new Map(cached);
		});
	}

	async getCachedTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		if (ColorGenCacheService.IGNORE_CACHE) {
			return undefined;
		}

		return Sentry.startSpan({ name: 'Get cached generated team colors', op: 'function' }, async () => {
			const cachedTeamColors = await Sentry.startSpan(
				{ name: 'Get cached generated team colors from Redis', op: 'db.redis' },
				async () => this.redis.hgetall(this.generatedColorsRedisKey(teamNumber)),
			);

			if (cachedTeamColors) {
				const parsed = CachedColorsSchema.parse(cachedTeamColors);

				return {
					...parsed,
					verified: false,
				};
			}
		});
	}

	private generatedColorsRedisKey(teamNumber: number): string {
		return `${configService.redisPrefix}generated-colors:${teamNumber}`;
	}
}

export const colorGenCacheService = new ColorGenCacheService(kv, configService);
