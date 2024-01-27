import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { ManyTeamColors, TeamColors } from '../dtos/colors.dto';

export type ColorFetcher = {
	getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
};
