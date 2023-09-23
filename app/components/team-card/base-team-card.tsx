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

export default function BaseTeamCard({ title, avatar, verifiedBadge, colors, actions }: Props) {
	return (
		<div className='rounded my-4 p-4 flex max-md:flex-col justify-between md:space-x-4 bg-neutral-800'>
			{/* Image container */}
			<div className='max-h-48 max-md:w-full flex justify-center items-center'>{avatar}</div>

			<div
				className={clsx('flex flex-col', {
					'max-md:justify-center': !colors,
					'justify-between space-y-4': colors,
				})}
			>
				{/* Team number & name */}
				<div className='flex space-x-1 items-center'>
					{title}
					{verifiedBadge}
				</div>

				{/* Colors */}
				{colors && (
					<div className='flex'>
						<div className='w-full flex max-md:flex-row max-md:space-x-4 max-md:justify-center md:flex-col md:space-y-4'>
							{colors.primary}
							{colors.secondary}
						</div>
					</div>
				)}

				{/* Actions */}
				{actions && <div className='flex space-x-4'>{actions}</div>}
			</div>
		</div>
	);
}
