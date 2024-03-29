import clsx from 'clsx';
import type React from 'react';

type Props = {
	bar?: boolean;
} & React.JSX.IntrinsicElements['div'];

export function LoadingSkeleton({ className, bar = true, ...rest }: Props) {
	return (
		<div role='status' className='animate-pulse'>
			<div
				{...rest}
				className={clsx([className], {
					'rounded-full': bar,
				})}
			/>
			<span className='sr-only'>Loading...</span>
		</div>
	);
}
