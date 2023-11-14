import { difference } from '@jonahsnider/util';
import * as Sentry from '@sentry/nextjs';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { FindManyTeams } from '../interfaces/find-many-teams.interface';
import { ColorsCacheService, MISSING_COLORS, colorsCacheService } from './cache/colors-cache.service';
import { ColorGenService, colorGenService } from './color-gen/color-gen.service';
import { TeamColorsSchema } from './saved-colors/dtos/team-colors-dto';
import { SavedColorsService, savedColorsService } from './saved-colors/saved-colors.service';

export class ColorsService {
	constructor(
		private readonly colorGen: ColorGenService,
		private readonly savedColors: SavedColorsService,
		private readonly colorsCache: ColorsCacheService,
		// biome-ignore lint/nursery/noEmptyBlockStatements: This has parameter properties
	) {}

	/** @returns The colors for a team. */
	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Get team colors', op: 'function' }, async () => {
			const cachedColors = await this.colorsCache.getTeamColors(teamNumber);

			if (cachedColors === MISSING_COLORS) {
				return undefined;
			}
			if (cachedColors) {
				return cachedColors;
			}

			const [savedTeamColors, generated] = await Promise.all([
				this.savedColors.findTeamColors(teamNumber),
				this.colorGen.getTeamColors(teamNumber),
			]);

			// Prefer colors from DB over the generated ones
			const colors = savedTeamColors ?? generated;

			if (colors) {
				// Since the cache was empty at the start of this function, we should set it now
				await this.colorsCache.setTeamColors(teamNumber, colors);

				return colors;
			}
		});
	}

	/** @returns The colors for a team. */
	async getManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<FindManyTeams> {
		return Sentry.startSpan({ name: 'Get many team colors', op: 'function' }, async () => {
			const cachedColors = await this.colorsCache.getManyTeamColors(teamNumbers);

			const notCachedTeams = [...difference(teamNumbers, [...cachedColors.keys()])];

			const [savedColors, generatedColors] = await Promise.all([
				this.savedColors.findTeamColors(notCachedTeams),
				this.colorGen.getManyTeamColors(notCachedTeams),
			]);

			const cacheOps: Map<TeamNumberSchema, TeamColorsSchema | MISSING_COLORS> = new Map();

			const result: FindManyTeams = new Map(
				teamNumbers.map((teamNumber) => {
					const cached = cachedColors.get(teamNumber);

					if (cached === MISSING_COLORS) {
						return [teamNumber, undefined] as const;
					}
					if (cached) {
						return [teamNumber, cached] as const;
					}

					// Prefer colors from DB over the generated ones
					const colors = savedColors.get(teamNumber) ?? generatedColors.get(teamNumber);

					cacheOps.set(teamNumber, colors ?? MISSING_COLORS);

					return [teamNumber, colors] as const;
				}),
			);

			await this.colorsCache.setManyTeamColors(cacheOps);

			return result;
		});
	}

	async setTeamColors(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): Promise<void> {
		await Promise.all([
			this.colorsCache.setTeamColors(teamNumber, colors),
			this.savedColors.saveTeamColors(teamNumber, colors),
		]);
	}
}

export const colorsService = new ColorsService(colorGenService, savedColorsService, colorsCacheService);
