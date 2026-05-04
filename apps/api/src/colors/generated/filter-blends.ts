import type { extractColors } from 'extract-colors';
import { BLACK_LAB, deltaE76, type LabColor, rgbToLab, WHITE_LAB } from './color-distance.ts';

type FinalColor = Awaited<ReturnType<typeof extractColors>>[number];

const BLEND_DISTANCE_TOLERANCE = 8;
const MIN_ENDPOINT_SEPARATION = 20;

function projectOntoSegment(point: LabColor, a: LabColor, b: LabColor): { distance: number; t: number } {
	const abL = b.l - a.l;
	const abA = b.a - a.a;
	const abB = b.b - a.b;
	const lengthSquared = abL * abL + abA * abA + abB * abB;

	if (lengthSquared === 0) {
		return { distance: deltaE76(point, a), t: 0 };
	}

	const apL = point.l - a.l;
	const apA = point.a - a.a;
	const apB = point.b - a.b;
	const t = (apL * abL + apA * abA + apB * abB) / lengthSquared;

	const projectionL = a.l + t * abL;
	const projectionA = a.a + t * abA;
	const projectionB = a.b + t * abB;

	const dl = point.l - projectionL;
	const da = point.a - projectionA;
	const db = point.b - projectionB;

	return { distance: Math.sqrt(dl * dl + da * da + db * db), t };
}

function isBlendOf(candidate: LabColor, a: LabColor, b: LabColor): boolean {
	if (deltaE76(a, b) < MIN_ENDPOINT_SEPARATION) {
		return false;
	}

	const { distance, t } = projectOntoSegment(candidate, a, b);

	if (t <= 0.05 || t >= 0.95) {
		return false;
	}

	return distance < BLEND_DISTANCE_TOLERANCE;
}

export function filterBlendArtifacts(colors: FinalColor[]): FinalColor[] {
	const labs = colors.map((color) => rgbToLab(color.red, color.green, color.blue));
	const endpoints: LabColor[] = [...labs, BLACK_LAB, WHITE_LAB];

	return colors.filter((_color, index) => {
		const candidate = labs[index];
		if (!candidate) {
			return true;
		}

		for (let i = 0; i < endpoints.length; i++) {
			const a = endpoints[i];
			if (!a || a === candidate) {
				continue;
			}
			for (let j = i + 1; j < endpoints.length; j++) {
				const b = endpoints[j];
				if (!b || b === candidate) {
					continue;
				}
				if (isBlendOf(candidate, a, b)) {
					return false;
				}
			}
		}

		return true;
	});
}
