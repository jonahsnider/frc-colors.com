import * as Sentry from '@sentry/nextjs';
import { VercelKV, kv } from '@vercel/kv';
import { configService } from '../../../config/config.service';
import { CACHE_TTL_GENERATED_COLORS, CACHE_TTL_VERIFIED_COLORS } from '../../../config/ttls-config';
import { TeamNumberSchema } from '../../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';
import { CachedColorsSchema } from './dtos/cached-colors.dto';

export const MISSING_COLORS = Symbol('Missing colors');
// biome-ignore lint/style/useNamingConvention: This is a literal
export type MISSING_COLORS = typeof MISSING_COLORS;

export class ColorsCacheService {
	// biome-ignore lint/complexity/useSimplifiedLogicExpression: This is a redundancy in case a changed value is accidentally committed
	private static readonly BYPASS_CACHE = false && configService.nodeEnv !== 'production';

	// biome-ignore lint/nursery/noEmptyBlockStatements: This has a parameter property
	constructor(private readonly redis: VercelKV) {}

	async setTeamColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema | MISSING_COLORS): Promise<void> {
		return Sentry.startSpan({ name: 'Set cached team colors', op: 'function' }, async () => {
			if (colors === MISSING_COLORS) {
				await this.setMissingColors(teamNumber);
			} else {
				await this.setColors(teamNumber, colors);
			}
		});
	}

	async setManyTeamColors(teamColors: Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS>): Promise<void> {
		return Sentry.startSpan({ name: 'Set cached team colors', op: 'function' }, async () => {
			if (teamColors.size === 0) {
				return;
			}

			const pipeline = this.redis.pipeline();

			for (const [teamNumber, colors] of teamColors.entries()) {
				if (colors === MISSING_COLORS) {
					pipeline.hset(this.colorsRedisKey(teamNumber), { missing: true } satisfies CachedColorsSchema);
					pipeline.expire(this.colorsRedisKey(teamNumber), CACHE_TTL_GENERATED_COLORS.to('seconds'));
				} else {
					pipeline.hset(this.colorsRedisKey(teamNumber), colors satisfies CachedColorsSchema);
					const ttl = colors.verified ? CACHE_TTL_VERIFIED_COLORS : CACHE_TTL_GENERATED_COLORS;
					pipeline.expire(this.colorsRedisKey(teamNumber), ttl.to('seconds'));
				}
			}

			await Sentry.startSpan({ name: 'Set many Redis keys for colors and missing colors', op: 'db.redis' }, async () =>
				pipeline.exec(),
			);
		});
	}

	async delTeamColors(teamNumber: TeamNumberSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Delete cached team colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Delete Redis key for colors and missing colors', op: 'db.redis' }, async () => {
				await this.redis.del(this.colorsRedisKey(teamNumber));
			});
		});
	}

	async getManyTeamColors(
		teamNumbers: TeamNumberSchema[],
	): Promise<Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS>> {
		if (ColorsCacheService.BYPASS_CACHE) {
			return new Map();
		}

		return Sentry.startSpan({ name: 'Get many cached team colors', op: 'function' }, async () => {
			if (teamNumbers.length === 0) {
				return new Map();
			}

			const pipeline = this.redis.pipeline();

			for (const teamNumber of teamNumbers) {
				pipeline.hgetall(this.colorsRedisKey(teamNumber));
			}

			const hashes = await Sentry.startSpan(
				{ name: 'Get many Redis keys for colors and missing colors', op: 'db.redis' },
				async () => pipeline.exec(),
			);

			const result = new Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS>();

			for (const [index, teamNumber] of teamNumbers.entries()) {
				const value = hashes[index];

				if (value !== null) {
					const parsed = CachedColorsSchema.parse(value);

					result.set(teamNumber, 'missing' in parsed ? MISSING_COLORS : parsed);
				}
			}

			return result;
		});
	}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | MISSING_COLORS | undefined> {
		if (ColorsCacheService.BYPASS_CACHE) {
			return undefined;
		}

		return Sentry.startSpan({ name: 'Get cached team colors and missing colors', op: 'function' }, async () => {
			const cachedTeamColors = await Sentry.startSpan(
				{ name: 'Get cached team colors from Redis', op: 'db.redis' },
				async () => this.redis.hgetall(this.colorsRedisKey(teamNumber)),
			);

			if (cachedTeamColors) {
				const parsed = CachedColorsSchema.parse(cachedTeamColors);

				if ('missing' in parsed) {
					return MISSING_COLORS;
				}

				return parsed;
			}
		});
	}

	private colorsRedisKey(teamNumber: TeamNumberSchema): string {
		return `colors:${teamNumber}`;
	}

	private async setMissingColors(teamNumber: TeamNumberSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Set cached missing colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Set Redis key for missing colors', op: 'db.redis' }, async () => {
				await this.redis.hset(this.colorsRedisKey(teamNumber), { missing: true } satisfies CachedColorsSchema);
				await this.redis.expire(this.colorsRedisKey(teamNumber), CACHE_TTL_GENERATED_COLORS.to('seconds'));
			});
		});
	}

	private async setColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Set Redis key for colors', op: 'db.redis' }, async () => {
			await this.redis.hset(this.colorsRedisKey(teamNumber), colors satisfies CachedColorsSchema);
			const ttl = colors.verified ? CACHE_TTL_VERIFIED_COLORS : CACHE_TTL_GENERATED_COLORS;
			await this.redis.expire(this.colorsRedisKey(teamNumber), ttl.to('seconds'));
		});
	}
}

export const colorsCacheService = new ColorsCacheService(kv);
