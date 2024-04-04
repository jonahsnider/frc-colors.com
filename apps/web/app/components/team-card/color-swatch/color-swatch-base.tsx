import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { Card, Text } from '@radix-ui/themes';
import clsx from 'clsx';

export function ColorSwatchBase({ hex }: { hex: HexColorCode }) {
	const cssClass = `swatch-${hex.slice('#'.length)}`;

	return (
		<Card className={clsx('px-rx-5 transition-colors text-center flex items-center justify-center w-full', cssClass)}>
			<style>
				{`.${cssClass} {
					--card-background-color: ${hex};
				}`}
			</style>

			<Text size='3' weight='bold' className='font-mono'>
				{hex}
			</Text>
		</Card>
	);
}
