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
	) {}

	/** @returns The colors for a team. */
	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Get team colors', op: 'function' }, async () => {
			const cachedColors = await this.colorsCache.getTeamColors(teamNumber);

			if (cachedColors === MISSING_COLORS) {
				return undefined;
			} else if (cachedColors) {
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

			const cacheOps: Promise<void>[] = [];

			const result: FindManyTeams = new Map(
				teamNumbers.map((teamNumber) => {
					const cached = cachedColors.get(teamNumber);

					if (cached === MISSING_COLORS) {
						return [teamNumber, undefined] as const;
					} else if (cached) {
						return [teamNumber, cached] as const;
					}

					// Prefer colors from DB over the generated ones
					const colors = savedColors.get(teamNumber) ?? generatedColors.get(teamNumber);

					cacheOps.push(this.colorsCache.setTeamColors(teamNumber, colors ?? MISSING_COLORS));

					return [teamNumber, colors] as const;
				}),
			);

			await Promise.all(cacheOps);

			return result;
		});
	}
}

export const colorsService = new ColorsService(colorGenService, savedColorsService, colorsCacheService);
