import { InternalTeamSchema } from '../internal/team/dtos/internal-team.dto';
import { TeamColorsSchema } from './colors/saved-colors/dtos/team-colors-dto';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { V0ColorsSchema, V0FindManyTeamsSchema, V0TeamSchema } from './dtos/v0/team.dto';
import { V1FindManyTeamSchema, V1FindManyTeamsSchema, V1TeamSchema } from './dtos/v1/team.dto';
import { FindManyTeams } from './interfaces/find-many-teams.interface';
import { InternalTeam } from './interfaces/internal-team';

export class TeamsSerializer {
	static teamColorsToDto(colors: TeamColorsSchema): V0ColorsSchema;
	static teamColorsToDto(colors?: undefined): null;
	static teamColorsToDto(colors?: TeamColorsSchema): V0ColorsSchema | null;
	static teamColorsToDto(colors?: TeamColorsSchema): V0ColorsSchema | null {
		return colors
			? {
					primaryHex: colors.primary,
					secondaryHex: colors.secondary,
					verified: colors.verified,
			  }
			: null;
	}

	static teamToV0Dto(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): V0TeamSchema {
		return {
			teamNumber,
			colors: this.teamColorsToDto(colors),
		};
	}

	static teamToV1Dto(teamNumber: TeamNumberSchema, colors: TeamColorsSchema): V1TeamSchema;
	static teamToV1Dto(teamNumber: TeamNumberSchema, colors?: undefined): V1FindManyTeamSchema;
	static teamToV1Dto(teamNumber: TeamNumberSchema, colors?: TeamColorsSchema): V1TeamSchema | V1FindManyTeamSchema;
	static teamToV1Dto(teamNumber: TeamNumberSchema, colors?: TeamColorsSchema): V1TeamSchema | V1FindManyTeamSchema {
		return {
			teamNumber,
			colors: this.teamColorsToDto(colors),
		};
	}

	static findManyTeamsToV0Dto(teams: FindManyTeams): V0FindManyTeamsSchema {
		const response: V0FindManyTeamsSchema = { teams: [] };

		for (const [teamNumber, colors] of Array.from(teams)) {
			if (colors) {
				response.teams.push({
					teamNumber,
					colors: this.teamColorsToDto(colors),
				});
			} else {
				response.teams.push(null);
			}
		}

		return response;
	}

	static findManyTeamsToV1Dto(teams: FindManyTeams): V1FindManyTeamsSchema {
		return {
			teams: Object.fromEntries(
				Array.from(teams).map(([teamNumber, colors]) => [teamNumber, this.teamToV1Dto(teamNumber, colors)]),
			),
		};
	}

	static internalTeamToDto(team: InternalTeam): InternalTeamSchema {
		return {
			avatarUrl: team.avatarUrl ?? null,
			teamName: team.teamName ?? null,
			teamNumber: team.teamNumber,
			colors: this.teamColorsToDto(team.colors),
		};
	}

	private constructor() {}
}
