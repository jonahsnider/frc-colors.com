import type { TeamNumber } from '../../teams/dtos/team-number.dto.ts';
import type { ManyTeamColors, TeamColors } from '../dtos/colors.dto.ts';

export type ColorFetcher = {
	getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
};
