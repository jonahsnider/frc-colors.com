import VerificationRequestButton from '@/app/(team)/verification-request-button';
import { trpc } from '@/app/trpc';
import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
import LoadingSkeleton from '../loading-skeleton';
import { getTeamAvatarUrl } from '../util/team-avatar-url';
import BaseTeamCard from './base-team-card';
import ColorSwatch from './color-swatch';
import TeamImage from './team-image/team-image';

type Props = {
	teamNumber: number;
};

export default function TeamCard({ teamNumber }: Props) {
	const teamNameQuery = trpc.teams.getName.useQuery(teamNumber);
	const colorsQuery = trpc.teams.colors.get.useQuery(teamNumber);

	const teamName = teamNameQuery.data?.name;
	const title = teamName ? `Team ${teamNumber} - ${teamName}` : `Team ${teamNumber}`;

	if (teamNameQuery.error || colorsQuery.error) {
		return <p>An error occurred while fetching team {teamNumber}'s information</p>;
	}

	return (
		<BaseTeamCard
			title={
				teamNameQuery.isLoading ? (
					<LoadingSkeleton className='w-72 h-6 bg-gray-500 mt-2' />
				) : (
					<p className='text-2xl font-bold'>{title}</p>
				)
			}
			avatar={<TeamImage avatarUrl={getTeamAvatarUrl(teamNumber)} colors={colorsQuery.data?.colors} />}
			colors={
				colorsQuery.data?.colors && {
					primary: <ColorSwatch hex={colorsQuery.data.colors?.primary} />,
					secondary: <ColorSwatch hex={colorsQuery.data.colors?.secondary} />,
				}
			}
			verifiedBadge={
				colorsQuery.isLoading ? (
					<CheckBadgeIcon className='max-md:h-0 md:h-6 invisible' />
				) : (
					<CheckBadgeIcon
						className={clsx('h-6 transition-opacity', {
							'opacity-0 max-md:h-0': !colorsQuery.data?.colors?.verified,
						})}
						color={colorsQuery.data?.colors?.primary}
						stroke={colorsQuery.data?.colors?.secondary}
					/>
				)
			}
			actions={
				!colorsQuery.data?.colors?.verified && colorsQuery.data && <VerificationRequestButton teamNumber={teamNumber} />
			}
		/>
	);
}
