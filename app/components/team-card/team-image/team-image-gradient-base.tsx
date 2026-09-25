import clsx from 'clsx';
import type { TeamColors } from '@/src/colors/dtos/colors.dto';

type Props = {
	colors: Pick<TeamColors, 'primary' | 'secondary'>;
	className?: string;
};

export function TeamImageGradientBase({ colors, className }: Props) {
	// Interpolate in OKLCH for perceptually uniform gradients without ugly muddy middles
	// https://www.joshwcomeau.com/css/make-beautiful-gradients/
	return (
		<div
			className={clsx('rounded-2 transition-colors w-48 h-48', className)}
			style={{
				backgroundImage: `linear-gradient(in oklch to bottom right, ${colors.primary}, ${colors.secondary})`,
			}}
		/>
	);
}
