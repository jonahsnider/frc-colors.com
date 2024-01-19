import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import LoadingSkeleton from '../loading-skeleton';
import BaseTeamCard from './base-team-card';
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
	actions?: React.ReactNode;
	isLoading: boolean;
};

export default function TeamCard({ teamName, teamNumber, avatarUrl, colors, actions, isLoading }: Props) {
	const title = teamName ? `Team ${teamNumber} - ${teamName}` : `Team ${teamNumber}`;

	return (
		<BaseTeamCard
			title={
				isLoading ? (
					<LoadingSkeleton className='w-72 h-6 bg-gray-500 mt-2' />
				) : (
					<p className='text-2xl font-bold'>{title}</p>
				)
			}
			avatar={<TeamImage avatarUrl={avatarUrl} colors={colors} />}
			colors={
				colors && {
					primary: <ColorSwatch hex={colors.primaryHex} />,
					secondary: <ColorSwatch hex={colors.secondaryHex} />,
				}
			}
			verifiedBadge={
				isLoading ? (
					<CheckBadgeIcon className='max-md:h-0 md:h-6 invisible' />
				) : (
					<CheckBadgeIcon
						className={clsx('h-6 transition-opacity', {
							'opacity-0 max-md:h-0': !colors?.verified,
						})}
						color={colors?.primaryHex}
						stroke={colors?.secondaryHex}
					/>
				)
			}
			actions={actions}
		/>
	);
}
