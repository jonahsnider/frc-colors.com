import { TbaService, tbaService } from '../../tba/tba.service';
import { TeamColors } from '../../colors/interfaces/team-colors';
import { TeamNumberSchema } from '../dtos/team-number.dto';
// @ts-expect-error Their types are wrong, see https://github.com/Namide/extract-colors/issues/39
import { extractColors } from 'extract-colors';
import getPixelsCb from 'get-pixels';
import { promisify } from 'util';
import { Sort } from '@jonahsnider/util';
import { NdArray } from 'ndarray';

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

	constructor(private readonly tba: TbaService) {}

	async getTeamColorsForYear(teamNumber: TeamNumberSchema, year: number): Promise<TeamColors | undefined> {
		const teamAvatar = await this.tba.getTeamAvatarForYear(teamNumber, year);

		if (!teamAvatar) {
			return undefined;
		}

		const pixels = await this.getPixels(teamAvatar);
		let colors = await this.extractColors(pixels, true);

		// If there aren't enough colors, try extracting again with less strict filtering
		if (colors.length < 2) {
			colors = await this.extractColors(pixels, false);
		}

		colors.sort(Sort.descending((color) => color.area));

		const [primary, secondary] = colors;

		if (!primary) {
			return undefined;
		}

		return {
			primary: primary.hex.toLowerCase(),
			secondary: secondary?.hex?.toLowerCase() ?? '#ffffff',
			verified: false,
		};
	}

	private async getPixels(teamAvatar: Buffer): Promise<NdArray<Uint8Array>> {
		return getPixels(teamAvatar, 'image/png');
	}

	private async extractColors(
		pixels: NdArray<Uint8Array>,
		strict: boolean,
	): Promise<
		({ hex: string } & Record<
			'red' | 'green' | 'blue' | 'area' | 'hue' | 'saturation' | 'lightness' | 'intensity',
			number
		>)[]
	> {
		return extractColors(
			{ data: Array.from(pixels.data), width: 40, height: 40 },
			{
				pixels: 40 * 40,
				colorValidator: strict ? ColorGenService.STRICT_COLOR_VALIDATOR : ColorGenService.NON_STRICT_COLOR_VALIDATOR,
			},
		);
	}
}

export const colorGenService = new ColorGenService(tbaService);
