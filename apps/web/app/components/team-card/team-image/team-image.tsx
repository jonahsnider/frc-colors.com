import { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import TeamImageAvatar from './team-image-avatar';
import TeamImageBlank from './team-image-blank';
import TeamImageGradient from './team-image-gradient';

type Props = {
	avatarUrl?: string;
	colors?: TeamColors;
};

export default function TeamImage({ avatarUrl, colors }: Props) {
	if (avatarUrl) {
		return <TeamImageAvatar colors={colors} avatarUrl={avatarUrl} />;
	}

	if (colors) {
		// Return a box with a diagonal gradient of the team's colors
		return <TeamImageGradient colors={colors} />;
	}

	// Return a gray box
	return <TeamImageBlank />;
}
