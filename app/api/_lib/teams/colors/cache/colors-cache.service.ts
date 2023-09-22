import * as Sentry from '@sentry/nextjs';
import { VercelKV, kv } from '@vercel/kv';
import { configService } from '../../../config/config.service';
import { CACHE_TTL_GENERATED_COLORS, CACHE_TTL_VERIFIED_COLORS } from '../../../config/ttls-config';
import { TeamNumberSchema } from '../../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';

export const MISSING_COLORS = Symbol('Missing colors');
// biome-ignore lint/style/useNamingConvention: This is a literal
export type MISSING_COLORS = typeof MISSING_COLORS;

export class ColorsCacheService {
	// biome-ignore lint/complexity/useSimplifiedLogicExpression: This is a redundancy in case a changed value is accidentally committed
	private static readonly IGNORE_CACHE = false && configService.nodeEnv !== 'production';

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

	async delTeamColors(teamNumber: TeamNumberSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Delete cached team colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Delete Redis key for colors and missing colors', op: 'db.redis' }, async () => {
				await this.redis.del(this.colorsRedisKey(teamNumber), this.missingColorsRedisKey(teamNumber));
			});
		});
	}

	async getManyTeamColors(
		teamNumbers: TeamNumberSchema[],
	): Promise<Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS>> {
		if (ColorsCacheService.IGNORE_CACHE) {
			return new Map();
		}

		return Sentry.startSpan({ name: 'Get many cached team colors', op: 'function' }, async () => {
			const [rawCached, missingColors] = await Promise.all([
				Promise.all(teamNumbers.map(async (teamNumber) => [teamNumber, await this.getTeamColors(teamNumber)] as const)),
				this.getManyMissingColors(teamNumbers),
			]);
			const cached = rawCached.filter((tuple): tuple is [TeamNumberSchema, TeamColorsSchema] => Boolean(tuple[1]));

			const result = new Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS>(cached);

			for (const teamNumber of missingColors) {
				result.set(teamNumber, MISSING_COLORS);
			}

			return result;
		});
	}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | MISSING_COLORS | undefined> {
		if (ColorsCacheService.IGNORE_CACHE) {
			return undefined;
		}

		return Sentry.startSpan({ name: 'Get cached team colors and missing colors', op: 'function' }, async () => {
			const [cachedTeamColors, missingColors] = await Promise.all([
				Sentry.startSpan({ name: 'Get cached team colors from Redis', op: 'db.redis' }, async () =>
					this.redis.hgetall(this.colorsRedisKey(teamNumber)),
				),
				this.getMissingColors(teamNumber),
			]);

			if (missingColors) {
				return MISSING_COLORS;
			}

			if (cachedTeamColors) {
				const parsed = TeamColorsSchema.parse(cachedTeamColors);

				return parsed;
			}
		});
	}

	private colorsRedisKey(teamNumber: TeamNumberSchema): string {
		return `${configService.redisPrefix}colors:${teamNumber}`;
	}

	private missingColorsRedisKey(teamNumber: TeamNumberSchema): string {
		return `${configService.redisPrefix}missing-colors:${teamNumber}`;
	}

	private async setMissingColors(teamNumber: TeamNumberSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Set cached missing colors', op: 'function' }, async () => {
			await Sentry.startSpan({ name: 'Set Redis key for missing colors', op: 'db.redis' }, async () =>
				this.redis.set(this.missingColorsRedisKey(teamNumber), 'true', {
					ex: CACHE_TTL_GENERATED_COLORS.to('seconds'),
				}),
			);
		});
	}

	private async setColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): Promise<void> {
		await Sentry.startSpan({ name: 'Set Redis key for colors', op: 'db.redis' }, async () => {
			await this.redis.hset(this.colorsRedisKey(teamNumber), colors);
			const ttl = colors.verified ? CACHE_TTL_VERIFIED_COLORS : CACHE_TTL_GENERATED_COLORS;
			await this.redis.expire(this.colorsRedisKey(teamNumber), ttl.to('seconds'));
		});
	}

	private async getMissingColors(teamNumber: TeamNumberSchema): Promise<boolean> {
		return Sentry.startSpan({ name: 'Get cached missing colors', op: 'function' }, async () => {
			const missingColors = await Sentry.startSpan(
				{ name: 'Get cached missing colors from Redis', op: 'db.redis' },
				async () => this.redis.exists(this.missingColorsRedisKey(teamNumber)),
			);

			return Boolean(missingColors);
		});
	}

	private async getManyMissingColors(teamNumbers: TeamNumberSchema[]): Promise<Set<TeamNumberSchema>> {
		return Sentry.startSpan({ name: 'Get many cached missing colors', op: 'function' }, async () => {
			const missing = new Set<TeamNumberSchema>();

			const missingColors = await Sentry.startSpan(
				{ name: 'Get many cached missing colors from Redis', op: 'db.redis' },
				async () =>
					Promise.all(teamNumbers.map(async (teamNumber) => Boolean(await this.getMissingColors(teamNumber)))),
			);

			for (const [index, isMissingColors] of missingColors.entries()) {
				if (isMissingColors) {
					const teamNumber = teamNumbers[index];
					missing.add(teamNumber);
				}
			}

			return missing;
		});
	}
}

export const colorsCacheService = new ColorsCacheService(kv);
