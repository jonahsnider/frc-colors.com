import { Card } from '@radix-ui/themes';
import clsx from 'clsx';
import type { ReactNode } from 'react';

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
		<Card className='my-rx-3 flex max-md:flex-col justify-between md:gap-x-4'>
			{/* Image container */}
			<div className='max-h-48 max-md:w-full flex justify-center items-center'>{avatar}</div>

			<div
				className={clsx('flex flex-col justify-between', {
					'max-md:justify-center': !colors,
					'gap-y-4': colors,
				})}
			>
				{/* Team number & name */}
				<div className='flex gap-x-rx-2 items-center'>
					{title}
					{verifiedBadge}
				</div>

				<div className='w-full flex flex-col md:flex-row justify-between md:items-end gap-x-rx-2 gap-y-rx-4'>
					{/* Colors */}

					<div className='flex md:flex-col gap-rx-2'>
						{colors?.primary}
						{colors?.secondary}
					</div>

					{/* Actions */}
					{actions && <div className='flex flex-col items-end'>{actions}</div>}
				</div>
			</div>
		</Card>
	);
}
