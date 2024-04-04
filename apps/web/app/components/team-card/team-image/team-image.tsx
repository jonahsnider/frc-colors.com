import type { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { TeamImageAvatar } from './team-image-avatar';
import { TeamImageGradient } from './team-image-gradient';

type Props = {
	avatarUrl?: string;
	colors?: TeamColors;
};

export function TeamImage({ avatarUrl, colors }: Props) {
	if (avatarUrl) {
		return <TeamImageAvatar colors={colors} avatarUrl={avatarUrl} />;
	}

	// Return a box with a diagonal gradient of the team's colors
	return <TeamImageGradient colors={colors ?? 'none'} />;
}
