import { Sort, difference } from '@jonahsnider/util';
import * as Sentry from '@sentry/nextjs';
import { extractColors } from 'extract-colors';
import { PNG } from 'pngjs/browser';
import { AvatarsService, avatarsService } from '../avatars/avatars.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';
import { ColorGenCacheService, colorGenCacheService } from './color-gen-cache.service';

type ColorValidator = (red: number, green: number, blue: number, alpha?: number) => boolean;

export class ColorGenService {
	private static readonly STRICT_COLOR_VALIDATOR: ColorValidator = (red, green, blue, alpha = 255) =>
		// Not too transparent
		alpha > 250 &&
		// Not too white
		!(red > 250 && green > 250 && blue > 250) &&
		// Not too black
		!(red < 5 && green < 5 && blue < 5);

	private static readonly NON_STRICT_COLOR_VALIDATOR: ColorValidator = (_red, _green, _blue, alpha = 255) =>
		// Not too transparent
		alpha > 250;

	constructor(private readonly avatars: AvatarsService, private readonly cache: ColorGenCacheService) {}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Get generated team colors', op: 'function' }, async () => {
			const cached = await this.cache.getCachedTeamColors(teamNumber);

			if (cached !== undefined) {
				return cached;
			}

			const teamAvatar = await this.avatars.getAvatar(teamNumber);

			if (!teamAvatar) {
				return undefined;
			}

			return this.generateTeamColors(teamAvatar, teamNumber);
		});
	}

	async getManyTeamColors(
		teamNumbers: TeamNumberSchema[],
	): Promise<Map<TeamNumberSchema, TeamColorsSchema | undefined>> {
		return Sentry.startSpan({ name: 'Get many generated team colors', op: 'function' }, async () => {
			const cached = await this.cache.getManyCachedTeamColors(teamNumbers);

			const missingColors = difference<TeamNumberSchema>(teamNumbers, cached.keys());

			const avatarsToExtractFrom = await this.avatars.getAvatars(Array.from(missingColors));

			const generatedColors = new Map<TeamNumberSchema, TeamColorsSchema | undefined>(
				await Promise.all(
					[...avatarsToExtractFrom]
						.filter((tuple): tuple is [TeamNumberSchema, Buffer] => Boolean(tuple[1]))
						.map(
							async ([teamNumber, avatar]) => [teamNumber, await this.generateTeamColors(avatar, teamNumber)] as const,
						),
				),
			);

			const result: Map<TeamNumberSchema, TeamColorsSchema | undefined> = new Map();

			for (const teamNumber of teamNumbers) {
				const colors = cached.get(teamNumber) ?? generatedColors.get(teamNumber);

				result.set(teamNumber, colors);
			}

			return result;
		});
	}

	private async getPixels(teamAvatar: Buffer): Promise<Uint8Array | undefined> {
		return Sentry.startSpan(
			{ name: 'Get pixels', op: 'function' },
			async () =>
				new Promise((resolve, reject) => {
					new PNG({ width: 40, height: 40 }).parse(teamAvatar, (error, data) => {
						if (error) {
							reject(error);
							return;
						}

						resolve(data.data);
					});
				}),
		);
	}

	private async extractColors(pixels: Uint8Array, strict: boolean): Promise<ReturnType<typeof extractColors>> {
		return Sentry.startSpan({ name: 'Extract colors', op: 'function' }, async () =>
			extractColors(
				{ data: Array.from(pixels), width: 40, height: 40 },
				{
					pixels: 40 * 40,
					colorValidator: strict ? ColorGenService.STRICT_COLOR_VALIDATOR : ColorGenService.NON_STRICT_COLOR_VALIDATOR,
				},
			),
		);
	}

	private async generateTeamColors(
		teamAvatar: Buffer,
		teamNumber: TeamNumberSchema,
	): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Generate team colors', op: 'function' }, async () => {
			const pixels = await this.getPixels(teamAvatar);

			if (!pixels) {
				return undefined;
			}

			let extractedColors = await this.extractColors(pixels, true);

			// If there aren't enough colors, try extracting again with less strict filtering
			if (extractedColors.length < 2) {
				extractedColors = await this.extractColors(pixels, false);
			}

			extractedColors.sort(Sort.descending((color) => color.area));

			const [primary, secondary] = extractedColors;

			if (!primary) {
				return undefined;
			}

			const colors = {
				primary: primary.hex.toLowerCase(),
				secondary: secondary?.hex?.toLowerCase() ?? '#ffffff',
				verified: false,
			};

			await this.cache.setCachedTeamColors(teamNumber, colors);

			return colors;
		});
	}
}

export const colorGenService = new ColorGenService(avatarsService, colorGenCacheService);
