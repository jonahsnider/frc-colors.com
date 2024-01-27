import { chunk } from '@jonahsnider/util';
import convert from 'convert';
import { inArray } from 'drizzle-orm';
import pLimit from 'p-limit';
import { db } from '../db/db';
import { Schema } from '../db/index';
import { firstService } from '../first/first.service';
import { logger as baseLogger } from '../logger/logger';
import { tbaService } from '../tba/tba.service';
import { TeamNumber } from '../teams/dtos/team-number.dto';

export class CacheManager {
	private static readonly BATCH_SIZE = 100;
	private static readonly CACHE_SWEEP_INTERVAL = convert(1, 'day');
	private static readonly AVATAR_TTL = convert(1, 'day');
	private readonly avatarExpiredTeams: TeamNumber[] = [];
	// biome-ignore lint/correctness/noUndeclaredVariables: Global type from Bun
	private timer: Timer | undefined;
	private readonly logger = baseLogger.withTag('cache manager');
	private allTeamNumbers: TeamNumber[] | undefined;

	init() {
		if (this.timer) {
			throw new Error('CacheManager already initialized');
		}

		this.timer = setInterval(this.refresh.bind(this), CacheManager.CACHE_SWEEP_INTERVAL.to('ms'));
	}

	async refresh(): Promise<void> {
		this.logger.start('Refreshing stale cached avatars');

		this.allTeamNumbers ??= await firstService.getAllTeamNumbers();

		const allTeamsBatches = chunk(this.allTeamNumbers, CacheManager.BATCH_SIZE);

		for (const [index, batch] of allTeamsBatches.entries()) {
			const outdatedTeams = new Set(batch);
			const avatars = await db.select().from(Schema.avatars).where(inArray(Schema.avatars.teamId, batch));

			for (const avatar of avatars) {
				if (avatar.createdAt.getTime() + CacheManager.AVATAR_TTL.to('ms') > Date.now()) {
					outdatedTeams.delete(avatar.teamId);
				}
			}

			this.avatarExpiredTeams.push(...outdatedTeams);

			this.logger
				.withTag(`batch ${index + 1}/${allTeamsBatches.length}`)
				.debug(`Found ${outdatedTeams.size} expired avatars`);
		}

		this.logger.success(`Found ${this.avatarExpiredTeams.length} expired avatars`);

		const limit = pLimit(10);

		const avatarCacheOperations = this.avatarExpiredTeams.map((team) =>
			limit(async () => {
				const avatar = await tbaService.getTeamAvatarForThisYear(team);

				await db.transaction(async (tx) => {
					await tx.insert(Schema.teams).values({ id: team }).onConflictDoNothing();
					await tx
						.insert(Schema.avatars)
						.values({ teamId: team, createdAt: new Date(), png: avatar })
						.onConflictDoUpdate({
							target: Schema.avatars.teamId,
							set: { createdAt: new Date(), png: avatar },
						});
				});
			}),
		);

		this.logger.start('Loading avatars from TBA and storing them in cache');
		const avatarCacheLogInterval = setInterval(() => {
			this.logger
				.withTag('avatar cache')
				.debug(`Completed ${avatarCacheOperations.length - limit.pendingCount}/${avatarCacheOperations.length} operations`);
		}, 1000);
		try {
			await Promise.all(avatarCacheOperations);
		} finally {
			clearInterval(avatarCacheLogInterval);
		}

		this.logger.success('Finished refreshing stale cached avatars');
	}
}

export const cacheManager = new CacheManager();
