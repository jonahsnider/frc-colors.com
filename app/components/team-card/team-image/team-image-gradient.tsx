import clsx from 'clsx';

type Props = {
	colors: {
		primaryHex: string;
		secondaryHex: string;
	};
	className?: string;
};

export default function TeamImageGradient({ colors, className }: Props) {
	return (
		<div
			className={clsx('rounded transition-colors w-48 h-48', className)}
			style={{
				backgroundImage: `linear-gradient(to bottom right, ${colors.primaryHex}, ${colors.secondaryHex})`,
			}}
		/>
	);
}
