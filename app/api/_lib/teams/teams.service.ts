import { difference, intersection } from '@jonahsnider/util';
import { BaseHttpException } from '../exceptions/base.exception';
import { InternalTeamSchema } from '../internal/team/dtos/internal-team.dto';
import { TbaService, tbaService } from '../tba/tba.service';
import { ColorGenService, colorGenService } from './color-gen/color-gen.service';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { TeamSchema } from './dtos/team.dto';
import { NoTeamColorsException } from './exceptions/no-team-colors.exception';
import { TeamNotFoundException } from './exceptions/team-not-found.exception';
import { TeamColors } from './saved-colors/interfaces/team-colors';
import { SavedColorsService, savedColorsService } from './saved-colors/saved-colors.service';

export class TeamsService {
	private static teamColorsToDTO(teamNumber: TeamNumberSchema, colors: TeamColors): TeamSchema {
		return {
			teamNumber: teamNumber,
			colors: {
				primaryHex: colors.primary,
				secondaryHex: colors.secondary,
				verified: colors.verified,
			},
		};
	}

	constructor(
		private readonly colorGen: ColorGenService,
		private readonly tba: TbaService,
		private readonly savedColors: SavedColorsService,
	) {}

	/** @returns The colors for a team. */
	async getTeamColors(
		teamNumber: TeamNumberSchema,
	): Promise<TeamSchema | NoTeamColorsException | TeamNotFoundException> {
		const savedTeamColors = await this.savedColors.findTeamColors(teamNumber);

		if (savedTeamColors) {
			return TeamsService.teamColorsToDTO(teamNumber, savedTeamColors);
		}

		const colors = await this.colorGen.getTeamColors(teamNumber);

		if (colors) {
			return TeamsService.teamColorsToDTO(teamNumber, colors);
		}

		return new NoTeamColorsException(teamNumber);
	}

	/** @returns The colors for a team. */
	async getManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Array<TeamSchema | undefined>> {
		const savedColors = await this.savedColors.findTeamColors(teamNumbers);
		const missingColors = difference<TeamNumberSchema>(teamNumbers, savedColors.keys());

		const generatedColors = new Map(
			await Promise.all(
				Array.from(missingColors).map(
					async (teamNumber) => [teamNumber, await this.colorGen.getTeamColors(teamNumber)] as const,
				),
			),
		);

		return teamNumbers.map((teamNumber) => {
			const colors = savedColors.get(teamNumber) ?? generatedColors.get(teamNumber);

			return colors ? TeamsService.teamColorsToDTO(teamNumber, colors) : undefined;
		});
	}

	async getTeamColorsForEvent(eventCode: string): Promise<TeamSchema[]> {
		const teams = await this.tba.getTeamsForEvent(eventCode);

		const teamColors = await this.getManyTeamColors(teams);

		return teamColors.filter((teamColor): teamColor is TeamSchema => teamColor !== undefined);
	}

	/** @returns `undefined` if the team exists, or an exception if it doesn't. */
	async teamExists(teamNumber: TeamNumberSchema): Promise<TeamNotFoundException | undefined> {
		const nameOrException = await this.getTeamName(teamNumber);

		if (typeof nameOrException !== 'string') {
			return nameOrException;
		}
	}

	/** @returns The team's nickname or name (nickname is used if available), or an exception if it doesn't exist. */
	async getTeamName(teamNumber: TeamNumberSchema): Promise<string | TeamNotFoundException> {
		const name = await this.tba.getTeamName(teamNumber);

		if (name) {
			return name;
		}

		return new TeamNotFoundException(teamNumber);
	}

	async getInternalTeam(teamNumber: TeamNumberSchema): Promise<InternalTeamSchema> {
		const [teamName, team, avatarBase64] = await Promise.all([
			this.getTeamName(teamNumber),
			this.getTeamColors(teamNumber),
			this.tba.getTeamAvatarForThisYear(teamNumber),
		]);

		const avatarUrl = avatarBase64 ? `data:image/png;base64,${avatarBase64?.toString('base64')}` : undefined;

		return {
			teamNumber,
			...(team instanceof BaseHttpException ? undefined : team),
			teamName: teamName instanceof BaseHttpException ? undefined : teamName,
			avatarUrl,
		};
	}
}

export const teamsService = new TeamsService(colorGenService, tbaService, savedColorsService);
