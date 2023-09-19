import { VercelKV, kv } from '@vercel/kv';
import convert from 'convert';
import { ConfigService, configService } from '../../config/config.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';
import { CachedColorsSchema } from './dtos/cached-colors.dto';

/** Used to mark a team as missing an avatar on TBA, to avoid trying to fetch one. */
export const MISSING_AVATAR = Symbol('MISSING_AVATAR');
// biome-ignore lint/style/useNamingConvention: Pascal case convention isn't applicable here
export type MISSING_AVATAR = typeof MISSING_AVATAR;

export class ColorGenCacheService {
	private static readonly GENERATED_COLORS_CACHE_TTL = convert(7, 'day');

	constructor(private readonly redis: VercelKV, private readonly config: ConfigService) {}

	async setCachedTeamColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema | MISSING_AVATAR): Promise<void> {
		if (!this.config.redisCacheEnabled) {
			return;
		}

		if (colors === MISSING_AVATAR) {
			await this.redis.set(this.missingAvatarRedisKey(teamNumber), '1', {
				ex: ColorGenCacheService.GENERATED_COLORS_CACHE_TTL.to('seconds'),
			});
		} else {
			await this.redis.del(this.missingAvatarRedisKey(teamNumber));
			await this.redis.hset(this.generatedColorsRedisKey(teamNumber), {
				primary: colors.primary,
				secondary: colors.secondary,
			});
			await this.redis.expire(
				this.generatedColorsRedisKey(teamNumber),
				ColorGenCacheService.GENERATED_COLORS_CACHE_TTL.to('seconds'),
			);
		}
	}

	async getCachedTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | MISSING_AVATAR | undefined> {
		if (!this.config.redisCacheEnabled) {
			return undefined;
		}

		const missingAvatar = await this.redis.exists(this.missingAvatarRedisKey(teamNumber));

		if (missingAvatar) {
			return MISSING_AVATAR;
		}

		const cachedTeamColors = await this.redis.hgetall(this.generatedColorsRedisKey(teamNumber));

		if (cachedTeamColors) {
			const parsed = CachedColorsSchema.parse(cachedTeamColors);

			return {
				...parsed,
				verified: false,
			};
		}
	}

	private generatedColorsRedisKey(teamNumber: number): string {
		return `${configService.redisPrefix}generated-colors:${teamNumber}`;
	}

	private missingAvatarRedisKey(teamNumber: number): string {
		return `${configService.redisPrefix}missing-avatar:${teamNumber}`;
	}
}

export const colorGenCacheService = new ColorGenCacheService(kv, configService);
