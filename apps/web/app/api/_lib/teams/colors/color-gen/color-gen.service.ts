import { Sort } from '@jonahsnider/util';
import * as Sentry from '@sentry/nextjs';
import { extractColors } from 'extract-colors';
import { PNG } from 'pngjs/browser';
import { AvatarsService, avatarsService } from '../../avatars/avatars.service';
import { TeamNumberSchema } from '../../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';

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

	// biome-ignore lint/nursery/noEmptyBlockStatements: This has a parameter property
	constructor(private readonly avatars: AvatarsService) {}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return Sentry.startSpan({ name: 'Get generated team colors', op: 'function' }, async () => {
			const teamAvatar = await this.avatars.getAvatar(teamNumber);

			if (!teamAvatar) {
				return undefined;
			}

			return this.generateTeamColors(teamAvatar);
		});
	}

	async getManyTeamColors(
		teamNumbers: TeamNumberSchema[],
	): Promise<Map<TeamNumberSchema, TeamColorsSchema | undefined>> {
		return Sentry.startSpan({ name: 'Get many generated team colors', op: 'function' }, async () => {
			const avatarsToExtractFrom = await this.avatars.getAvatars(Array.from(teamNumbers));

			const generatedColors = new Map<TeamNumberSchema, TeamColorsSchema | undefined>(
				await Promise.all(
					[...avatarsToExtractFrom]
						.filter((tuple): tuple is [TeamNumberSchema, Buffer] => Boolean(tuple[1]))
						.map(async ([teamNumber, avatar]) => [teamNumber, await this.generateTeamColors(avatar)] as const),
				),
			);

			return generatedColors;
		});
	}

	private async getPixels(teamAvatar: Buffer): Promise<Uint8Array | undefined> {
		return Sentry.startSpan({ name: 'Get pixels', op: 'function' }, async () => {
			return new Promise<Uint8Array | undefined>((resolve, _reject) => {
				new PNG({ width: 40, height: 40 }).parse(teamAvatar, (error, data) => {
					if (error) {
						// Ignore any errors that may happen from weird input
						resolve(undefined);
						return;
					}

					resolve(data.data);
				});
			});
		});
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

	private async generateTeamColors(teamAvatar: Buffer): Promise<TeamColorsSchema | undefined> {
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

			return colors;
		});
	}
}

export const colorGenService = new ColorGenService(avatarsService);
