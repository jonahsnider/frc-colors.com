import { chunk } from '@jonahsnider/util';
import convert from 'convert';
import { and, eq } from 'drizzle-orm';
import pLimit from 'p-limit';
import { generatedColors } from '../colors/generated/generated-colors.service';
import { db } from '../db/db';
import { Schema } from '../db/index';
import { firstService } from '../first/first.service';
import { logger as baseLogger } from '../logger/logger';
import { tbaService } from '../tba/tba.service';
import { TeamNumber } from '../teams/dtos/team-number.dto';

export class CacheManager {
	private static readonly COLOR_GEN_BATCH_SIZE = 100;
	private static readonly CACHE_SWEEP_INTERVAL = convert(1, 'day');
	private static readonly AVATAR_TTL = convert(1, 'day');

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
		this.logger.start('Cache refresh started');
		this.logger.withTag('avatar sweep').start('Refreshing stale cached avatars');

		const avatarExpiredTeams: TeamNumber[] = [];

		this.allTeamNumbers ??= await firstService.getAllTeamNumbers();

		const outdatedTeams = new Set(this.allTeamNumbers);
		const avatars = await db.select().from(Schema.avatars);

		for (const avatar of avatars) {
			if (avatar.createdAt.getTime() + CacheManager.AVATAR_TTL.to('ms') > Date.now()) {
				outdatedTeams.delete(avatar.team);
			}
		}

		avatarExpiredTeams.push(...outdatedTeams);

		this.logger.withTag('avatar sweep').debug(`Found ${outdatedTeams.size} expired or missing avatars`);

		this.logger.withTag('avatar sweep').success(`Found ${avatarExpiredTeams.length} expired avatars`);

		const avatarCacheLimit = pLimit(10);

		const avatarCacheOperations = avatarExpiredTeams.map((team) =>
			avatarCacheLimit(async () => {
				const avatar = await tbaService.getTeamAvatarForThisYear(team);

				await db.transaction(async (tx) => {
					await tx.insert(Schema.teams).values({ number: team }).onConflictDoNothing();
					await tx
						.insert(Schema.avatars)
						.values({ team: team, createdAt: new Date(), png: avatar })
						.onConflictDoUpdate({
							target: Schema.avatars.team,
							set: { createdAt: new Date(), png: avatar },
						});
				});
			}),
		);

		this.logger.withTag('avatar cache').start('Loading avatars from TBA and storing them in cache');
		const avatarCacheLogInterval = setInterval(() => {
			this.logger
				.withTag('avatar cache')
				.debug(
					`Saved ${avatarCacheOperations.length - avatarCacheLimit.pendingCount}/${
						avatarCacheOperations.length
					} avatars to cache`,
				);
		}, 1000);
		try {
			await Promise.all(avatarCacheOperations);
		} finally {
			clearInterval(avatarCacheLogInterval);
		}

		this.logger.withTag('avatar cache').success('Finished refreshing stale cached avatars');

		this.logger.withTag('extract colors').start('Extracting colors from newly cached avatars');
		const teamsWithNewAvatars = chunk(avatarExpiredTeams, CacheManager.COLOR_GEN_BATCH_SIZE);

		for (const [index, batch] of teamsWithNewAvatars.entries()) {
			const teamColors = await generatedColors.getTeamColors(batch);

			await db.transaction(async (tx) => {
				for (const [team, color] of teamColors) {
					if (color) {
						// Store colors in DB unless verified colors already exist
						await tx
							.insert(Schema.teamColors)
							.values({
								team: team,
								primaryHex: color.primary,
								secondaryHex: color.secondary,
								verified: false,
							})
							.onConflictDoUpdate({
								target: Schema.teamColors.team,
								set: {
									primaryHex: color.primary,
									secondaryHex: color.secondary,
									verified: false,
								},
								where: eq(Schema.teamColors.verified, false),
							});
					} else {
						// Clear colors from DB, unless they're verified
						await tx
							.delete(Schema.teamColors)
							.where(and(eq(Schema.teamColors.team, team), eq(Schema.teamColors.verified, false)));
					}
				}
			});

			this.logger
				.withTag('extract colors')
				.withTag(`batch ${index + 1}/${teamsWithNewAvatars.length}`)
				.debug(`Extracted colors from ${batch.length} avatars`);
		}
		this.logger.withTag('extract colors').success('Finished extracting colors from newly cached avatars');

		this.logger.success('Cache refresh finished');
	}
}

export const cacheManager = new CacheManager();
