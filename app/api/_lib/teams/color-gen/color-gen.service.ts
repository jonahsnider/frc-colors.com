import { TbaService, tbaService } from '../../tba/tba.service';
import { TeamColors } from '../../colors/interfaces/team-colors';
import { TeamNumberSchema } from '../dtos/team-number.dto';
// @ts-expect-error Their types are wrong, see https://github.com/Namide/extract-colors/issues/39
import { extractColors } from 'extract-colors';
import getPixelsCb from 'get-pixels';
import { promisify } from 'util';
import { Sort } from '@jonahsnider/util';

const getPixels = promisify(getPixelsCb);

export class ColorGenService {
	constructor(private readonly tba: TbaService) {}

	async getTeamColorsForYear(teamNumber: TeamNumberSchema, year: number): Promise<TeamColors | undefined> {
		const teamAvatar = await this.tba.getTeamAvatarForYear(teamNumber, year);

		if (!teamAvatar) {
			return undefined;
		}

		const pixels = await getPixels(teamAvatar, 'image/png');
		const colors: Array<
			{
				hex: string;
			} & Record<'red' | 'green' | 'blue' | 'area' | 'hue' | 'saturation' | 'lightness' | 'intensity', number>
		> = await extractColors(
			{ data: Array.from(pixels.data), width: 40, height: 40 },
			{
				pixels: 40 * 40,
				colorValidator: (red: number, green: number, blue: number, alpha = 255) =>
					// Not too transparent
					alpha > 250 &&
					// Not too white
					!(red > 250 && green > 250 && blue > 250) &&
					// Not too black
					!(red < 5 && green < 5 && blue < 5),
			},
		);

		colors.sort(Sort.descending((color) => color.area));

		const [primary, secondary] = colors;

		return { primary: primary.hex.toLowerCase(), secondary: secondary.hex.toLowerCase(), verified: false };
	}
}

export const colorGenService = new ColorGenService(tbaService);
