export type PixelStats = {
	opaque: number;
	black: number;
	white: number;
	chromatic: number;
};

const BLACK_LUMINANCE_MAX = 0.08;
const WHITE_LUMINANCE_MIN = 0.92;
const ALPHA_MIN = 250;
const MONOCHROME_CHROMATIC_THRESHOLD = 0.02;

export function isOpaquePixel(_red: number, _green: number, _blue: number, alpha = 255): boolean {
	return alpha >= ALPHA_MIN;
}

function relativeLuminance(red: number, green: number, blue: number): number {
	const linearize = (channel: number) => {
		const normalized = channel / 255;
		return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
	};

	return 0.2126 * linearize(red) + 0.7152 * linearize(green) + 0.0722 * linearize(blue);
}

export function classifyPixels(pixels: Uint8Array | Uint8ClampedArray): PixelStats {
	const stats: PixelStats = { opaque: 0, black: 0, white: 0, chromatic: 0 };

	for (let index = 0; index < pixels.length; index += 4) {
		const red = pixels[index] ?? 0;
		const green = pixels[index + 1] ?? 0;
		const blue = pixels[index + 2] ?? 0;
		const alpha = pixels[index + 3] ?? 0;

		if (alpha < ALPHA_MIN) {
			continue;
		}

		stats.opaque++;

		const luminance = relativeLuminance(red, green, blue);

		if (luminance <= BLACK_LUMINANCE_MAX) {
			stats.black++;
		} else if (luminance >= WHITE_LUMINANCE_MIN) {
			stats.white++;
		} else {
			stats.chromatic++;
		}
	}

	return stats;
}

export function isMonochromeAvatar(stats: PixelStats): boolean {
	if (stats.opaque === 0) {
		return false;
	}

	return stats.chromatic / stats.opaque < MONOCHROME_CHROMATIC_THRESHOLD;
}
