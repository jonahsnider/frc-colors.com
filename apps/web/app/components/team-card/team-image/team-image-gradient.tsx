import { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import clsx from 'clsx';

type Props = {
	colors: Pick<TeamColors, 'primary' | 'secondary'>;
	className?: string;
};

export default function TeamImageGradient({ colors, className }: Props) {
	return (
		<div
			className={clsx('rounded transition-colors w-48 h-48', className)}
			style={{
				backgroundImage: `linear-gradient(to bottom right, ${colors.primary}, ${colors.secondary})`,
			}}
		/>
	);
}
