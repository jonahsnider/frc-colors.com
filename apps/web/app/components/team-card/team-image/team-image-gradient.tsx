import type { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { sage, sageDark } from '@radix-ui/colors';
import { useTheme } from 'next-themes';
import { TeamImageGradientBase } from './team-image-gradient-base';

type Props = {
	colors: Pick<TeamColors, 'primary' | 'secondary'> | 'none';
	className?: string;
};

export function TeamImageGradient({ colors, className }: Props) {
	const { resolvedTheme } = useTheme();

	const fallbackColorScheme = resolvedTheme === 'dark' ? sageDark : sage;
	const fallbackColors = {
		primary: fallbackColorScheme.sage6,
		secondary: fallbackColorScheme.sage3,
	};

	const usedColors = colors === 'none' ? fallbackColors : colors;

	return <TeamImageGradientBase colors={usedColors} className={className} />;
}
