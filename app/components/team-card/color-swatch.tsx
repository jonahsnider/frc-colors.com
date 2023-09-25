import { HexColorCodeSchema } from '@/app/api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';
import clsx from 'clsx';
import luminance from 'color-luminance';

export default function ColorSwatch({ hex }: { hex: HexColorCodeSchema }) {
	const hexNumber = Number.parseInt(hex.slice(1), 16);

	const isDark = luminance([(hexNumber >> 16) & 0xff, (hexNumber >> 8) & 0xff, hexNumber & 0xff]) < 0.5 * 255;

	return (
		<div
			className={clsx(
				'w-full md:w-28 h-12 transition-colors rounded outline-none font-bold text-center flex items-center justify-center shadow shadow-black',
				{
					'text-neutral-200': isDark,
					'text-neutral-800': !isDark,
				},
			)}
			style={{ backgroundColor: hex }}
		>
			{hex}
		</div>
	);
}
