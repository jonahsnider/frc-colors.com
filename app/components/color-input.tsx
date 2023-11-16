'use client';

import { capitalize } from '@jonahsnider/util';
import clsx from 'clsx';
import { HexColorCodeSchema } from '../api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';

type Props = {
	kind: 'primary' | 'secondary';
	rawColor: string;
	onValidChange: (color: HexColorCodeSchema | undefined) => void;
	onChange: (color: string) => void;
	className?: string;
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

export default function ColorInput({ kind, onValidChange, onChange, rawColor, className }: Props) {
	const color = parseRawColor(rawColor);
	const valid = color.hex === '' || HexColorCodeSchema.safeParse(color.hex).success;

	return (
		<div className={clsx('rounded relative', className)}>
			<input
				className={clsx('transition-colors h-16 p-2 md:p-4 bg-transparent outline-none rounded border-4', {
					'border-red-400': !valid,
					'border-transparent': valid,
				})}
				placeholder={`${capitalize(kind)} color hex`}
				type='text'
				name={kind}
				onChange={(event) => {
					// @ts-expect-error bun-types breaks this
					onChange(event.target.value);

					// @ts-expect-error bun-types breaks this
					const parsed = HexColorCodeSchema.safeParse(parseRawColor(event.target.value).hex);

					if (parsed.success) {
						onValidChange(parsed.data);
					} else {
						onValidChange(undefined);
					}
				}}
				value={color.display}
			/>

			<div
				style={valid ? { backgroundColor: color.hex } : undefined}
				className={clsx('h-8 w-8 right-2 top-[1em] rounded absolute transition-colors', {
					'bg-transparent': !valid,
				})}
			/>
		</div>
	);
}
