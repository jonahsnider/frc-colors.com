export type LabColor = { l: number; a: number; b: number };

export const BLACK_LAB: LabColor = { l: 0, a: 0, b: 0 };
export const WHITE_LAB: LabColor = { l: 100, a: 0, b: 0 };

function srgbToLinear(channel: number): number {
	const normalized = channel / 255;
	return normalized <= 0.04045 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
}

function linearRgbToXyz(red: number, green: number, blue: number): [number, number, number] {
	const x = red * 0.4124564 + green * 0.3575761 + blue * 0.1804375;
	const y = red * 0.2126729 + green * 0.7151522 + blue * 0.072175;
	const z = red * 0.0193339 + green * 0.119192 + blue * 0.9503041;
	return [x, y, z];
}

const REFERENCE_WHITE = { x: 0.95047, y: 1, z: 1.08883 };

function xyzToLab(x: number, y: number, z: number): LabColor {
	const f = (value: number) => {
		const epsilon = 216 / 24389;
		const kappa = 24389 / 27;
		return value > epsilon ? Math.cbrt(value) : (kappa * value + 16) / 116;
	};

	const fx = f(x / REFERENCE_WHITE.x);
	const fy = f(y / REFERENCE_WHITE.y);
	const fz = f(z / REFERENCE_WHITE.z);

	return {
		l: 116 * fy - 16,
		a: 500 * (fx - fy),
		b: 200 * (fy - fz),
	};
}

export function rgbToLab(red: number, green: number, blue: number): LabColor {
	const [x, y, z] = linearRgbToXyz(srgbToLinear(red), srgbToLinear(green), srgbToLinear(blue));
	return xyzToLab(x, y, z);
}

export function deltaE76(a: LabColor, b: LabColor): number {
	const dl = a.l - b.l;
	const da = a.a - b.a;
	const db = a.b - b.b;
	return Math.sqrt(dl * dl + da * da + db * db);
}
