import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';

export function getTeamAvatarUrl(teamNumber: TeamNumber | string): string {
	return `https://avatars.frc.sh/teams/${encodeURIComponent(teamNumber)}.png`;
}
