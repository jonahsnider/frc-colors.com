import * as RadixColors from '@radix-ui/colors';
import { differenceCiede2000, nearest, parse, wcagLuminance } from 'culori';
import { useTheme } from 'next-themes';

type RadixAccentName = (typeof RADIX_ACCENT_COLOR_NAMES_LIST)[number];

const RADIX_ACCENT_COLOR_NAMES_LIST = [
	'gray',
	'gold',
	'bronze',
	'brown',
	'yellow',
	'amber',
	'orange',
	'tomato',
	'red',
	'ruby',
	'crimson',
	'pink',
	'plum',
	'purple',
	'violet',
	'iris',
	'indigo',
	'blue',
	'cyan',
	'teal',
	'jade',
	'green',
	'grass',
	'lime',
	'mint',
	'sky',
] as const;

const RADIX_ACCENT_COLOR_NAMES: ReadonlySet<string> = new Set(RADIX_ACCENT_COLOR_NAMES_LIST);

const RADIX_ACCENT_COLORS_LIGHT = Object.entries(RadixColors)
	.filter(([key]) => RADIX_ACCENT_COLOR_NAMES.has(key))
	.map(([key, table]) => [key as RadixAccentName, table[`${key}9` as keyof typeof table] as string] as const);
const RADIX_ACCENT_COLORS_DARK = Object.entries(RadixColors)
	.filter(([key]) => key.endsWith('Dark') && RADIX_ACCENT_COLOR_NAMES.has(key.replace('Dark', '')))
	.map(
		([key, table]) =>
			[
				key.replace('Dark', '') as RadixAccentName,
				table[`${key.replace('Dark', '')}9` as keyof typeof table] as string,
			] as const,
	);

const ACCENT_HEX_TO_NAME_LIGHT = new Map(RADIX_ACCENT_COLORS_LIGHT.map(([name, hex]) => [hex, name]));
const ACCENT_HEX_TO_NAME_DARK = new Map(RADIX_ACCENT_COLORS_DARK.map(([name, hex]) => [hex, name]));

export function useNearestAccentName(hex?: string): RadixAccentName | undefined {
	const theme = useTheme().resolvedTheme;

	if (!hex) {
		return undefined;
	}

	const isDarkTheme = theme === 'dark';
	const lookupTable = isDarkTheme ? RADIX_ACCENT_COLORS_DARK : RADIX_ACCENT_COLORS_LIGHT;
	const hexToName = isDarkTheme ? ACCENT_HEX_TO_NAME_DARK : ACCENT_HEX_TO_NAME_LIGHT;

	const findNearest = nearest(
		lookupTable.map(([_, accentHex]) => accentHex),
		differenceCiede2000(),
	);
	const [nearestHex] = findNearest(hex, 1);

	return nearestHex ? hexToName.get(nearestHex) : undefined;
}

export function isDark(hex: string): boolean {
	if (!parse(hex)) {
		return false;
	}

	return wcagLuminance(hex) < 0.5;
}
