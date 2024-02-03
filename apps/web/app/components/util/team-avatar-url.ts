import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';

export function getTeamAvatarUrl(teamNumber: TeamNumber | string): string {
	return `/api/internal/team/${encodeURIComponent(teamNumber)}/avatar.png`;
}
