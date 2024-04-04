import type { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import clsx from 'clsx';
import * as d3 from 'd3-color';

type Props = {
	colors: Pick<TeamColors, 'primary' | 'secondary'>;
	className?: string;
};

function hclToString(hcl: d3.HCLColor): string {
	const h = hcl.h || 0;
	const c = hcl.c || 0;
	const l = hcl.l || 0;

	return `lch(${l},${c},${h})`;
}

export function TeamImageGradient({ colors, className }: Props) {
	// Use HCL/LCH for gradients that don't look ugly in the middle https://www.joshwcomeau.com/css/make-beautiful-gradients/
	const primaryHcl = d3.hcl(colors.primary);
	const secondaryHcl = d3.hcl(colors.secondary);

	const primaryHclString = hclToString(primaryHcl);
	const secondaryHclString = hclToString(secondaryHcl);

	return (
		<div
			className={clsx('rounded-2 transition-colors w-48 h-48', className)}
			style={{
				backgroundImage: `linear-gradient(to bottom right, ${primaryHclString}, ${secondaryHclString})`,
			}}
		/>
	);
}
