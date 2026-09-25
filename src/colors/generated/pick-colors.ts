import type { extractColors } from 'extract-colors';
import type { HexColorCode, TeamColors } from '../dtos/colors.dto.ts';
import { BLACK_LAB, deltaE76, type LabColor, rgbToLab, WHITE_LAB } from './color-distance.ts';
import { isMonochromeAvatar, type PixelStats } from './pixel-stats.ts';

type FinalColor = Awaited<ReturnType<typeof extractColors>>[number];

const BLACK_HEX: HexColorCode = '#000000';
const WHITE_HEX: HexColorCode = '#ffffff';
const MIN_SECONDARY_DELTA_E = 12;

type SecondaryCandidate = {
	hex: HexColorCode;
	lab: LabColor;
	area: number;
};

function dominantAchromatic(stats: PixelStats): { primary: HexColorCode; secondary: HexColorCode } {
	if (stats.black >= stats.white) {
		return { primary: BLACK_HEX, secondary: WHITE_HEX };
	}
	return { primary: WHITE_HEX, secondary: BLACK_HEX };
}

function buildCandidates(colors: FinalColor[], stats: PixelStats, primary: FinalColor): SecondaryCandidate[] {
	const candidates: SecondaryCandidate[] = [];

	if (stats.opaque > 0) {
		if (stats.black > 0) {
			candidates.push({ hex: BLACK_HEX, lab: BLACK_LAB, area: stats.black / stats.opaque });
		}
		if (stats.white > 0) {
			candidates.push({ hex: WHITE_HEX, lab: WHITE_LAB, area: stats.white / stats.opaque });
		}
	}

	for (const color of colors) {
		if (color === primary) {
			continue;
		}
		candidates.push({
			hex: color.hex.toLowerCase() as HexColorCode,
			lab: rgbToLab(color.red, color.green, color.blue),
			area: color.area,
		});
	}

	return candidates;
}

function pickSecondary(primary: FinalColor, colors: FinalColor[], stats: PixelStats): HexColorCode {
	const primaryLab = rgbToLab(primary.red, primary.green, primary.blue);
	const candidates = buildCandidates(colors, stats, primary);

	let best: SecondaryCandidate | undefined;
	for (const candidate of candidates) {
		if (deltaE76(primaryLab, candidate.lab) < MIN_SECONDARY_DELTA_E) {
			continue;
		}
		if (!best || candidate.area > best.area) {
			best = candidate;
		}
	}

	if (best) {
		return best.hex;
	}

	return stats.black >= stats.white ? BLACK_HEX : WHITE_HEX;
}

export function pickTeamColors(colors: FinalColor[], stats: PixelStats): TeamColors | undefined {
	if (isMonochromeAvatar(stats)) {
		return { ...dominantAchromatic(stats), verified: false };
	}

	const sorted = colors.toSorted((a, b) => b.area - a.area);
	const [primary] = sorted;

	if (!primary) {
		if (stats.opaque === 0) {
			return undefined;
		}
		return { ...dominantAchromatic(stats), verified: false };
	}

	return {
		primary: primary.hex.toLowerCase() as HexColorCode,
		secondary: pickSecondary(primary, sorted, stats),
		verified: false,
	};
}
