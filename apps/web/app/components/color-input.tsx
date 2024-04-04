'use client';

import { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { capitalize } from '@jonahsnider/util';
import { TextField, Theme } from '@radix-ui/themes';
import { isDark } from './util/color-util';

type Props = {
	kind: 'primary' | 'secondary';
	rawColor: string;
	onValidChange: (color: HexColorCode | undefined) => void;
	onChange: (color: string) => void;
};

type ParsedColor = {
	display: string;
	hex: string;
};

function parseRawColor(rawColor: string): ParsedColor {
	if (rawColor === '') {
		return {
			display: '',
			hex: '',
		};
	}

	if (rawColor.startsWith('#')) {
		return {
			display: rawColor.toLowerCase(),
			hex: rawColor.toLowerCase(),
		};
	}

	return {
		display: rawColor.toLowerCase(),
		hex: `#${rawColor.toLowerCase()}`,
	};
}

export function ColorInput({ kind, onValidChange, onChange, rawColor }: Props) {
	const color = parseRawColor(rawColor);
	const valid = color.hex === '' || HexColorCode.safeParse(color.hex).success;

	const colorIsDarkRaw = isDark(color.hex);
	let appearance: 'dark' | 'light' | 'inherit' = 'inherit';

	if (valid && color.hex) {
		appearance = colorIsDarkRaw ? 'dark' : 'light';
	}

	return (
		<Theme appearance={appearance} hasBackground={false} className='w-full'>
			<TextField.Root
				type='text'
				placeholder={`${capitalize(kind)} color hex`}
				className='transition-colors w-full'
				onChange={(event) => {
					onChange(event.target.value);

					const parsed = HexColorCode.safeParse(parseRawColor(event.target.value).hex);

					if (parsed.success) {
						onValidChange(parsed.data);
					} else {
						onValidChange(undefined);
					}
				}}
				value={color.display}
				color={valid ? undefined : 'red'}
				style={
					valid && color.hex
						? {
								backgroundColor: color.hex,
						  }
						: undefined
				}
			/>
		</Theme>
	);
}
