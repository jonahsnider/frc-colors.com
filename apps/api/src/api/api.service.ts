import { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto';
import { ManyTeamColorsHttp, TeamColorsHttp } from './interfaces/http.interface';

export class ApiService {
	static teamColorsToDto(colors: TeamColors): TeamColorsHttp {
		return {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		};
	}

	static manyTeamColorsToDto(colors: ManyTeamColors): ManyTeamColorsHttp {
		const mapped: Record<string, TeamColorsHttp | null> = {};

		for (const [team, teamColors] of colors) {
			mapped[team] = teamColors ? ApiService.teamColorsToDto(teamColors) : null;
		}

		return {
			colors: mapped,
		};
	}
}
