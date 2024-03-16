import { Sort } from '@jonahsnider/util';
import { extractColors } from 'extract-colors';
import { PNG } from 'pngjs/browser';
import { avatarService } from '../../teams/avatar/avatar.service';
import type { TeamNumber } from '../../teams/dtos/team-number.dto';
import type { ManyTeamColors, TeamColors } from '../dtos/colors.dto';
import type { ColorFetcher } from '../interfaces/color-fetcher.interface';

type ColorValidator = (red: number, green: number, blue: number, alpha?: number) => boolean;

export class GeneratedColors implements ColorFetcher {
	getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
	getTeamColors(teams: TeamNumber | TeamNumber[]): Promise<TeamColors | ManyTeamColors | undefined> {
		if (Array.isArray(teams)) {
			return this.getManyTeamColors(teams);
		}

		return this.getOneTeamColors(teams);
	}

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

	private async getOneTeamColors(teamNumber: TeamNumber): Promise<TeamColors | undefined> {
		const teamAvatar = await avatarService.getAvatar(teamNumber);

		if (!teamAvatar) {
			return undefined;
		}

		return this.generateTeamColors(teamAvatar);
	}

	private async getManyTeamColors(teamNumbers: TeamNumber[]): Promise<Map<TeamNumber, TeamColors | undefined>> {
		const avatarsToExtractFrom = await avatarService.getAvatars(Array.from(teamNumbers));

		const generatedColors = new Map<TeamNumber, TeamColors | undefined>(
			await Promise.all(
				[...avatarsToExtractFrom]
					.filter((tuple): tuple is [TeamNumber, Buffer] => Boolean(tuple[1]))
					.map(async ([teamNumber, avatar]) => [teamNumber, await this.generateTeamColors(avatar)] as const),
			),
		);

		return generatedColors;
	}

	private async getPixels(teamAvatar: Buffer): Promise<Uint8Array | undefined> {
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
	}

	// biome-ignore lint/suspicious/useAwait: Required to make this compile
	private async extractColors(pixels: Uint8Array, strict: boolean): Promise<ReturnType<typeof extractColors>> {
		return extractColors(
			{ data: Array.from(pixels), width: 40, height: 40 },
			{
				pixels: 40 * 40,
				colorValidator: strict ? GeneratedColors.STRICT_COLOR_VALIDATOR : GeneratedColors.NON_STRICT_COLOR_VALIDATOR,
			},
		);
	}

	private async generateTeamColors(teamAvatar: Buffer): Promise<TeamColors | undefined> {
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
	}
}
