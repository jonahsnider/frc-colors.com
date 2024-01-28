import clsx from 'clsx';
import { ReactNode } from 'react';

type Props = {
	title: ReactNode;
	avatar?: ReactNode;
	verifiedBadge?: ReactNode;
	colors?: {
		primary: ReactNode;
		secondary: ReactNode;
	};
	actions?: ReactNode;
};

export function BaseTeamCard({ title, avatar, verifiedBadge, colors, actions }: Props) {
	return (
		<div className='rounded my-4 p-4 flex max-md:flex-col justify-between md:gap-x-4 bg-neutral-800 shadow shadow-neutral-950'>
			{/* Image container */}
			<div className='max-h-48 max-md:w-full flex justify-center items-center'>{avatar}</div>

			<div
				className={clsx('flex flex-col', {
					'max-md:justify-center': !colors,
					'justify-between gap-y-4': colors,
				})}
			>
				{/* Team number & name */}
				<div className='flex gap-x-1 items-center'>
					{title}
					{verifiedBadge}
				</div>

				<div
					className={clsx('flex gap-x-4 md:gap-x-16', {
						'md:justify-between': colors,
						'justify-end h-full': !colors,
					})}
				>
					{/* Colors */}
					{colors && (
						<div className='flex flex-row gap-x-4 justify-center w-full md:flex-col md:gap-y-4 md:w-auto'>
							{colors.primary}
							{colors.secondary}
						</div>
					)}

					{/* Actions */}
					{actions && <div className='flex flex-col justify-end'>{actions}</div>}
				</div>
			</div>
		</div>
	);
}
