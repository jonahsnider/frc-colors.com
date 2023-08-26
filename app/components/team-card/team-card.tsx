import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import clsx from 'clsx';
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
};

export default function TeamCard({ teamName, teamNumber, avatarUrl, colors }: Props) {
	const title = teamName ? `Team ${teamNumber} - ${teamName}` : `Team ${teamNumber}`;

	return (
		<BaseTeamCard
			title={title}
			avatar={<TeamImage avatarUrl={avatarUrl} colors={colors} />}
			colors={
				colors && {
					primary: <ColorSwatch hex={colors.primaryHex} />,
					secondary: <ColorSwatch hex={colors.secondaryHex} />,
				}
			}
			verifiedBadge={
				<CheckBadgeIcon
					className={clsx('h-6 transition-opacity', { 'opacity-0': !colors?.verified })}
					color={colors?.primaryHex}
					stroke={colors?.secondaryHex}
				/>
			}
		/>
	);
}
