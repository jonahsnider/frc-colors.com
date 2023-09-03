import { TbaService, tbaService } from '../../tba/tba.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { Sort } from '@jonahsnider/util';
import { extractColors } from 'extract-colors';
import getPixelsCb from 'get-pixels';
import { NdArray } from 'ndarray';
import { promisify } from 'util';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';
import { ColorGenCacheService, MISSING_AVATAR, colorGenCacheService } from './color-gen-cache.service';

const getPixels = promisify(getPixelsCb);

type ColorValidator = (red: number, green: number, blue: number, alpha?: number) => boolean;

export class ColorGenService {
	private static readonly STRICT_COLOR_VALIDATOR: ColorValidator = (red, green, blue, alpha = 255) =>
		// Not too transparent
		alpha > 250 &&
		// Not too white
		!(red > 250 && green > 250 && blue > 250) &&
		// Not too black
		!(red < 5 && green < 5 && blue < 5);

	private static readonly NON_STRICT_COLOR_VALIDATOR: ColorValidator = (red, green, blue, alpha = 255) =>
		// Not too transparent
		alpha > 250;

	constructor(private readonly tba: TbaService, private readonly cache: ColorGenCacheService) {}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		const cached = await this.cache.getCachedTeamColors(teamNumber);

		if (cached !== MISSING_AVATAR && cached !== undefined) {
			return cached;
		}

		const teamAvatar = cached === MISSING_AVATAR ? undefined : await this.tba.getTeamAvatarForThisYear(teamNumber);

		if (!teamAvatar) {
			return undefined;
		}

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
	}

	private async getPixels(teamAvatar: Buffer): Promise<ReturnType<typeof getPixels> | undefined> {
		try {
			return await getPixels(teamAvatar, 'image/png');
		} catch {}
	}

	private async extractColors(pixels: NdArray<Uint8Array>, strict: boolean): Promise<ReturnType<typeof extractColors>> {
		return extractColors(
			{ data: Array.from(pixels.data), width: 40, height: 40 },
			{
				pixels: 40 * 40,
				colorValidator: strict ? ColorGenService.STRICT_COLOR_VALIDATOR : ColorGenService.NON_STRICT_COLOR_VALIDATOR,
			},
		);
	}
}

export const colorGenService = new ColorGenService(tbaService, colorGenCacheService);
