import { ReactNode } from 'react';

type Props = {
	title: ReactNode;
	avatar?: ReactNode;
	verifiedBadge?: ReactNode;
	colors?: {
		primary: ReactNode;
		secondary: ReactNode;
	};
};

export default function BaseTeamCard({ title, avatar, verifiedBadge, colors }: Props) {
	return (
		<div className='bg-neutral-200 rounded my-4 p-4 flex max-md:flex-col justify-between space-x-4'>
			{/* Image container */}

			<div className='max-h-48'>{avatar}</div>

			{/* Team number div is at top, color div is at bottom */}
			<div className='space-y-4 flex flex-col justify-between'>
				{/* Team number & name */}
				<div className='flex space-x-1 items-center'>
					<p className='text-2xl font-bold'>{title}</p>
					{verifiedBadge}
				</div>

				{colors && (
					<div className='flex'>
						{/* Colors */}
						<div className='flex max-md:flex-row max-md:space-x-4 max-md:justify-center md:flex-col md:space-y-4'>
							{colors.primary}
							{colors.secondary}
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
