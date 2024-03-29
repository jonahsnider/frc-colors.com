import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import clsx from 'clsx';
import luminance from 'color-luminance';

export function ColorSwatch({ hex }: { hex: HexColorCode }) {
	const hexNumber = Number.parseInt(hex.slice(1), 16);

	const isDark = luminance([(hexNumber >> 16) & 0xff, (hexNumber >> 8) & 0xff, hexNumber & 0xff]) < 0.5 * 255;

	return (
		<div
			className={clsx(
				'w-full md:px-8 min-h-12 transition-colors rounded outline-none font-bold text-center flex items-center justify-center lg:text-xl',
				{
					'text-white': isDark,
					'text-black': !isDark,
				},
			)}
			style={{ backgroundColor: hex }}
		>
			{hex}
		</div>
	);
}
