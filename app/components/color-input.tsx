'use client';

import { capitalize } from '@jonahsnider/util';
import clsx from 'clsx';
import { useState } from 'react';
import { HexColorCodeSchema } from '../api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';

type Props = {
	kind: 'primary' | 'secondary';
	onChange: (color: HexColorCodeSchema | undefined) => void;
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

export default function ColorInput({ kind, onChange }: Props) {
	const [rawColor, setRawColor] = useState('');
	const color = parseRawColor(rawColor);
	const valid = color.hex === '' || HexColorCodeSchema.safeParse(color.hex).success;

	return (
		<div className='flex flex-col gap-y-4'>
			<input
				className={clsx('transition-all h-14 rounded p-4 outline-none bg-neutral-800 shadow shadow-neutral-950', {
					'border-4 border-red-400': !valid,
				})}
				placeholder={`${capitalize(kind)} color hex`}
				type='text'
				name={kind}
				onChange={(event) => {
					// @ts-expect-error bun-types breaks this
					setRawColor(event.target.value);

					// @ts-expect-error bun-types breaks this
					const parsed = HexColorCodeSchema.safeParse(parseRawColor(event.target.value).hex);

					if (parsed.success) {
						onChange(parsed.data);
					} else {
						onChange(undefined);
					}
				}}
				value={color.display}
			/>
		</div>
	);
}
