import { convexQuery } from '@convex-dev/react-query';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { Heading, Skeleton, Text, Theme, Tooltip } from '@radix-ui/themes';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import { VerificationRequestButton } from '@/app/components/verification-request-button';
import { useTeamName } from '@/app/hooks/use-team-name';
import { api } from '@/convex/_generated/api';
import { useNearestAccentName } from '../util/color-util';
import { getTeamAvatarUrl } from '../util/team-avatar-url';
import { BaseTeamCard } from './base-team-card';
import { ColorSwatch } from './color-swatch/color-swatch';
import { TeamImage } from './team-image/team-image';

type Props = {
	teamNumber: number;
	className?: string;
};

export function TeamCard({ teamNumber, className }: Props) {
	const teamNameQuery = useTeamName(teamNumber);
	const { data: colors } = useQuery(convexQuery(api.colors.getOne, { team: teamNumber }));

	const teamName = teamNameQuery.name;
	const title = teamName ? `Team ${teamNumber} - ${teamName}` : `Team ${teamNumber}`;

	const accentColor = useNearestAccentName(colors?.primary);

	return (
		<Theme accentColor={accentColor} grayColor='auto' className={className}>
			<BaseTeamCard
				title={
					<Heading size='6' as='h2'>
						<Skeleton loading={teamNameQuery.isPending}>{teamNameQuery.isPending ? 'a'.repeat(25) : title}</Skeleton>
					</Heading>
				}
				avatar={<TeamImage avatarUrl={getTeamAvatarUrl(teamNumber)} colors={colors ?? undefined} />}
				colors={{
					// Evil array trick is needed to make <Skeleton>'s logic with React children do what we want (don't render the children when it's loading)
					primary: (
						<Skeleton loading={colors === undefined} className='max-md:w-full'>
							{[<ColorSwatch key='primary' hex={colors?.primary} loading={colors === undefined} />]}
						</Skeleton>
					),
					secondary: (
						<Skeleton loading={colors === undefined} className='max-md:w-full'>
							{[<ColorSwatch key='secondary' hex={colors?.secondary} loading={colors === undefined} />]}
						</Skeleton>
					),
				}}
				verifiedBadge={
					colors === undefined ? (
						<CheckBadgeIcon height='22' width='22' className='invisible' />
					) : (
						<Tooltip content={<Text size='2'>These colors have been verified by a human</Text>}>
							<CheckBadgeIcon
								className={clsx('h-8 transition-opacity text-accent-9', {
									'opacity-0 max-md:h-0': !colors?.verified,
								})}
							/>
						</Tooltip>
					)
				}
				actions={
					<Skeleton loading={colors === undefined}>
						{[<VerificationRequestButton key='button' teamNumber={teamNumber} />]}
					</Skeleton>
				}
			/>
		</Theme>
	);
}
