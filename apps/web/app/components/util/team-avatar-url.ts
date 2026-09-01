import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';

export function getTeamAvatarUrl(teamNumber: TeamNumber | string): string {
	return `https://avatars.frc.sh/teams/${encodeURIComponent(teamNumber)}.png`;
}
