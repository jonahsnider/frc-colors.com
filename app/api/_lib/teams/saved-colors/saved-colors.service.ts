import * as Sentry from '@sentry/nextjs';
import { eq, inArray } from 'drizzle-orm';
import { Db, db } from '../../db/db';
import { Schema } from '../../db/index';
import { ColorGenCacheService, colorGenCacheService } from '../color-gen/color-gen-cache.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { HexColorCodeSchema } from './dtos/hex-color-code.dto';
import { TeamColorsSchema } from './dtos/team-colors-dto';

export class SavedColorsService {
	constructor(private readonly colorGenCache: ColorGenCacheService, private readonly db: Db) {}

	async findTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined>;
	async findTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, TeamColorsSchema>>;
	async findTeamColors(
		teamNumber: TeamNumberSchema | TeamNumberSchema[],
	): Promise<TeamColorsSchema | undefined | Map<TeamNumberSchema, TeamColorsSchema>> {
		return Sentry.startSpan({ name: 'Find team saved colors', op: 'function' }, async () => {
			if (typeof teamNumber === 'number') {
				return this.findOneTeamColors(teamNumber);
			}

			return this.findManyTeamColors(teamNumber);
		});
	}

	async saveTeamColors(
		teamNumber: TeamNumberSchema,
		colors: Pick<TeamColorsSchema, 'primary' | 'secondary'>,
	): Promise<void> {
		return Sentry.startSpan({ name: 'Save team colors', op: 'function' }, async () => {
			const teamColor = { primaryColorHex: colors.primary, secondaryColorHex: colors.secondary };

			await Promise.all([
				// Remove the cached colors, since the values in DB replace them
				this.colorGenCache.delCachedTeamColors(teamNumber),

				this.db.transaction(async (tx) => {
					await tx.insert(Schema.teams).values({ id: teamNumber }).onConflictDoNothing();

					await tx
						.insert(Schema.teamColors)
						.values({ teamId: teamNumber, ...teamColor })
						.onConflictDoUpdate({
							target: Schema.teamColors.teamId,
							set: teamColor,
						});
				}),
			]);
		});
	}

	private async findManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, TeamColorsSchema>> {
		return Sentry.startSpan({ name: 'Find many team saved colors', op: 'function' }, async () => {
			const teamColors = await this.db.query.teamColors.findMany({
				where: inArray(Schema.teamColors.teamId, teamNumbers),
				columns: {
					teamId: true,
					primaryColorHex: true,
					secondaryColorHex: true,
				},
			});

			return new Map(
				teamColors.map((teamColor) => [
					teamColor.teamId,
					{
						primary: HexColorCodeSchema.parse(teamColor.primaryColorHex.toLowerCase()),
						secondary: HexColorCodeSchema.parse(teamColor.secondaryColorHex.toLowerCase()),
						verified: true,
					},
				]),
			);
		});
	}

	private async findOneTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Find one team saved colors', op: 'function' }, async () => {
			const teamColors = await this.db.query.teamColors.findFirst({
				where: eq(Schema.teamColors.teamId, teamNumber),
				columns: {
					primaryColorHex: true,
					secondaryColorHex: true,
				},
			});

			if (teamColors) {
				return {
					primary: HexColorCodeSchema.parse(teamColors.primaryColorHex.toLowerCase()),
					secondary: HexColorCodeSchema.parse(teamColors.secondaryColorHex.toLowerCase()),
					verified: true,
				};
			}

			return undefined;
		});
	}
}

export const savedColorsService = new SavedColorsService(colorGenCacheService, db);
