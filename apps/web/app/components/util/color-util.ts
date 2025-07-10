import * as RadixColors from '@radix-ui/colors';
import { closest, type RGBColor } from 'color-diff';
import getLuminance from 'color-luminance';
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

const ACCENT_HEX_TO_NAME = new Map(
	[...RADIX_ACCENT_COLORS_LIGHT, ...RADIX_ACCENT_COLORS_DARK].map(([name, hex]) => [hex, name]),
);

function parseHex(hex: string) {
	const hexNumber = Number.parseInt(hex.replace('#', ''), 16);

	const color = {
		r: (hexNumber >> 16) & 0xff,
		g: (hexNumber >> 8) & 0xff,
		b: hexNumber & 0xff,
	};

	return color;
}

function rgbToColorDiffRgb({ r, g, b }: Record<'r' | 'g' | 'b', number>): RGBColor {
	return { R: r, G: g, B: b };
}

function rgbToHex({ r, g, b }: Record<'r' | 'g' | 'b', number>): string {
	return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

export function getNearestAccentName(hex?: string): RadixAccentName | undefined {
	const theme = useTheme().resolvedTheme;

	if (!hex) {
		return undefined;
	}

	const color = parseHex(hex);

	const lookupTable = theme === 'dark' ? RADIX_ACCENT_COLORS_DARK : RADIX_ACCENT_COLORS_LIGHT;

	const nearestAccent = closest(
		rgbToColorDiffRgb(color),
		lookupTable.map(([_, accentHex]) => rgbToColorDiffRgb(parseHex(accentHex))),
	);

	const accentHex = rgbToHex({ r: nearestAccent.R, g: nearestAccent.G, b: nearestAccent.B });

	return ACCENT_HEX_TO_NAME.get(accentHex) ?? undefined;
}

export function isDark(hex: string): boolean {
	const rgb = parseHex(hex);
	const luminance = getLuminance([rgb.r, rgb.g, rgb.b]);

	return luminance < 0.5 * 255;
}
