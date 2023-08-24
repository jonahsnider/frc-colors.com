import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import ColorSwatch from './color-swatch';
import TeamImage from './team-image/team-image';

type Props = {
	teamNumber: number;
	teamName?: string;
	avatarUrl?: string;
	colors?: {
		primaryHex: string;
		secondaryHex: string;
		verified: boolean;
	};
};

export default function TeamCard({ teamName, teamNumber, avatarUrl, colors }: Props) {
	return (
		<div className='bg-neutral-200 rounded my-4 p-4 flex space-x-4 justify-between'>
			{/* Image container */}

			<div>
				<TeamImage avatarUrl={avatarUrl} colors={colors} />
			</div>

			{/* Team number div is at top, color div is at bottom */}
			<div className='basis-3/4 space-y-4 flex flex-col justify-between'>
				{/* Team number & name */}
				<div className='flex space-x-1 items-center'>
					<p className='text-2xl font-bold'>
						{teamName && (
							<>
								Team {teamNumber} - {teamName}
							</>
						)}
						{!teamName && <>Team {teamNumber}</>}
					</p>
					<CheckBadgeIcon
						className={clsx('h-6 transition-opacity', { 'opacity-0': !colors?.verified })}
						color={colors?.primaryHex}
						stroke={colors?.secondaryHex}
					/>
				</div>

				{colors && (
					<div className='flex'>
						{/* Colors */}
						<div className='flex flex-col space-y-4'>
							<ColorSwatch hex={colors.primaryHex} />
							<ColorSwatch hex={colors.secondaryHex} />
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
