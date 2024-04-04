import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { Theme } from '@radix-ui/themes';
import { isDark } from '../../util/color-util';
import { ColorSwatchBase } from './color-swatch-base';

export function ColorSwatch({ hex, loading }: { hex?: HexColorCode; loading?: boolean }) {
	const usedHex = hex ?? '#ffffff';
	const appearance = isDark(usedHex) ? 'dark' : 'light';

	if (!(loading || hex)) {
		return <></>;
	}

	return (
		<Theme accentColor='gray' appearance={appearance} hasBackground={false} className='w-full'>
			<ColorSwatchBase hex={usedHex} />
		</Theme>
	);
}
