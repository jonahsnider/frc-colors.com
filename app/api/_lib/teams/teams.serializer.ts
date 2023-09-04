import { InternalTeamSchema } from '../internal/team/dtos/internal-team.dto';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { V0ColorsSchema, V0FindManyTeamsSchema, V0TeamSchema } from './dtos/v0/team.dto';
import { V1FindManyTeamSchema, V1FindManyTeamsSchema, V1TeamSchema } from './dtos/v1/team.dto';
import { FindManyTeams } from './interfaces/find-many-colors.interface';
import { InternalTeam } from './interfaces/internal-team';
import { TeamColorsSchema } from './saved-colors/dtos/team-colors-dto';

export class TeamsSerializer {
	static teamColorsToDTO(colors: TeamColorsSchema): V0ColorsSchema;
	static teamColorsToDTO(colors?: undefined): null;
	static teamColorsToDTO(colors?: TeamColorsSchema): V0ColorsSchema | null;
	static teamColorsToDTO(colors?: TeamColorsSchema): V0ColorsSchema | null {
		return colors
			? {
					primaryHex: colors.primary,
					secondaryHex: colors.secondary,
					verified: colors.verified,
			  }
			: null;
	}

	static teamToV0DTO(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): V0TeamSchema {
		return {
			teamNumber,
			colors: this.teamColorsToDTO(colors),
		};
	}

	static teamToV1DTO(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): V1TeamSchema;
	static teamToV1DTO(teamNumber: TeamNumberSchema, colors?: undefined): V1FindManyTeamSchema;
	static teamToV1DTO(teamNumber: TeamNumberSchema, colors?: TeamColorsSchema): V1TeamSchema | V1FindManyTeamSchema;
	static teamToV1DTO(teamNumber: TeamNumberSchema, colors?: TeamColorsSchema): V1TeamSchema | V1FindManyTeamSchema {
		return {
			teamNumber,
			colors: this.teamColorsToDTO(colors),
		};
	}

	static findManyTeamsToV0DTO(teams: FindManyTeams): V0FindManyTeamsSchema {
		const response: V0FindManyTeamsSchema = { teams: [] };

		for (const [teamNumber, colors] of Array.from(teams)) {
			if (colors) {
				response.teams.push({
					teamNumber,
					colors: this.teamColorsToDTO(colors),
				});
			} else {
				response.teams.push(null);
			}
		}

		return response;
	}

	static findManyTeamsToV1DTO(teams: FindManyTeams): V1FindManyTeamsSchema {
		return {
			teams: Object.fromEntries(
				Array.from(teams).map(([teamNumber, colors]) => [teamNumber, this.teamToV1DTO(teamNumber, colors)]),
			),
		};
	}

	static internalTeamToDTO(team: InternalTeam): InternalTeamSchema {
		return {
			avatarUrl: team.avatarUrl ?? null,
			teamName: team.teamName ?? null,
			teamNumber: team.teamNumber,
			colors: this.teamColorsToDTO(team.colors),
		};
	}

	private constructor() {}
}
