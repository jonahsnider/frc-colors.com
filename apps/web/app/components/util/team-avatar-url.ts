import { TeamNumberSchema } from '@/apps/web/app/api/_lib/teams/dtos/team-number.dto';

export function getTeamAvatarUrl(teamNumber: TeamNumberSchema | string): string {
	return `/api/internal/team/${teamNumber}/avatar.png`;
}
