import { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto';
import { TeamNumber } from '../teams/dtos/team-number.dto';
import { ManyTeamColorsHttp, ManyTeamColorsHttpEntry, TeamColorsHttp } from './interfaces/http.interface';

export class ApiService {
	static teamColorsToDto(colors: TeamColors): TeamColorsHttp {
		return {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		};
	}

	static manyTeamColorsToDto(colors: ManyTeamColors): ManyTeamColorsHttp {
		const mapped: Record<TeamNumber, ManyTeamColorsHttpEntry> = {};

		for (const [team, teamColors] of colors) {
			const colors = teamColors ? ApiService.teamColorsToDto(teamColors) : null;
			mapped[team] = {
				colors,
				teamNumber: team,
			};
		}

		return {
			teams: mapped,
		};
	}
}
