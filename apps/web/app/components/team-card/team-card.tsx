import { VerificationRequestButton } from '@/app/(team)/verification-request-button';
import { trpc } from '@/app/trpc';

import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { Heading, Skeleton, Text, Theme, Tooltip } from '@radix-ui/themes';
import clsx from 'clsx';
import { getNearestAccentName } from '../util/color-util';
import { getTeamAvatarUrl } from '../util/team-avatar-url';
import { BaseTeamCard } from './base-team-card';
import { ColorSwatch } from './color-swatch/color-swatch';
import { TeamImage } from './team-image/team-image';

type Props = {
	teamNumber: number;
};

export function TeamCard({ teamNumber }: Props) {
	const teamNameQuery = trpc.teams.getName.useQuery(teamNumber);
	const colorsQuery = trpc.teams.colors.get.useQuery(teamNumber);

	const teamName = teamNameQuery.data?.name;
	const title = teamName ? `Team ${teamNumber} - ${teamName}` : `Team ${teamNumber}`;

	const accentColor = getNearestAccentName(colorsQuery.data?.colors?.primary);

	if (teamNameQuery.error || colorsQuery.error) {
		return <p>An error occurred while fetching team {teamNumber}'s information</p>;
	}

	return (
		<Theme accentColor={accentColor} grayColor='auto'>
			<BaseTeamCard
				title={
					<Heading size='6' as='h2'>
						<Skeleton loading={teamNameQuery.isPending}>{teamNameQuery.isPending ? 'a'.repeat(25) : title}</Skeleton>
					</Heading>
				}
				avatar={<TeamImage avatarUrl={getTeamAvatarUrl(teamNumber)} colors={colorsQuery.data?.colors} />}
				colors={{
					// Evil array trick is needed to make <Skeleton>'s logic with React children do what we want (don't render the children when it's loading)
					primary: (
						<Skeleton loading={colorsQuery.isPending} className='max-md:w-full'>
							{[<ColorSwatch hex={colorsQuery.data?.colors?.primary} loading={colorsQuery.isPending} />]}
						</Skeleton>
					),
					secondary: (
						<Skeleton loading={colorsQuery.isPending} className='max-md:w-full'>
							{[<ColorSwatch hex={colorsQuery.data?.colors?.secondary} loading={colorsQuery.isPending} />]}
						</Skeleton>
					),
				}}
				verifiedBadge={
					colorsQuery.isLoading ? (
						<CheckBadgeIcon height='22' width='22' className='invisible' />
					) : (
						<Tooltip content={<Text size='2'>These colors have been verified by a human</Text>}>
							<CheckBadgeIcon
								className={clsx('h-8 transition-opacity text-accent-9', {
									'opacity-0 max-md:h-0': !colorsQuery.data?.colors?.verified,
								})}
							/>
						</Tooltip>
					)
				}
				actions={
					<Skeleton loading={colorsQuery.isPending}>{[<VerificationRequestButton teamNumber={teamNumber} />]}</Skeleton>
				}
			/>
		</Theme>
	);
}
