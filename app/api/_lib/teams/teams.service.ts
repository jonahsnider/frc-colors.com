import { difference } from '@jonahsnider/util';
import { TbaService, tbaService } from '../tba/tba.service';
import { ColorGenService, colorGenService } from './color-gen/color-gen.service';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { FindManyTeams } from './interfaces/find-many-colors.interface';
import { InternalTeam } from './interfaces/internal-team';
import { TeamColorsSchema } from './saved-colors/dtos/team-colors-dto';
import { SavedColorsService, savedColorsService } from './saved-colors/saved-colors.service';
import { TeamsSerializer } from './teams.serializer';

export class TeamsService {
	constructor(
		private readonly colorGen: ColorGenService,
		private readonly tba: TbaService,
		private readonly savedColors: SavedColorsService,
	) {}

	/** @returns The colors for a team. */
	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		const savedTeamColors = await this.savedColors.findTeamColors(teamNumber);

		if (savedTeamColors) {
			return savedTeamColors;
		}

		const colors = await this.colorGen.getTeamColors(teamNumber);

		if (colors) {
			return colors;
		}

		return undefined;
	}

	/** @returns The colors for a team. */
	async getManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<FindManyTeams> {
		const savedColors = await this.savedColors.findTeamColors(teamNumbers);
		const missingColors = difference<TeamNumberSchema>(teamNumbers, savedColors.keys());

		const generatedColors = new Map(
			await Promise.all(
				Array.from(missingColors).map(
					async (teamNumber) => [teamNumber, await this.colorGen.getTeamColors(teamNumber)] as const,
				),
			),
		);

		const result: FindManyTeams = new Map();

		for (const teamNumber of teamNumbers) {
			const colors = savedColors.get(teamNumber) ?? generatedColors.get(teamNumber);

			result.set(teamNumber, colors);
		}

		return result;
	}

	async getTeamColorsForEvent(eventCode: string): Promise<FindManyTeams> {
		const teams = await this.tba.getTeamsForEvent(eventCode);

		return this.getManyTeamColors(teams);
	}

	/** @returns The team's nickname or name (nickname is used if available). */
	async getTeamName(teamNumber: TeamNumberSchema): Promise<string | undefined> {
		return this.tba.getTeamName(teamNumber);
	}

	async getInternalTeam(teamNumber: TeamNumberSchema): Promise<InternalTeam> {
		const [teamName, teamColors, avatarBase64] = await Promise.all([
			this.getTeamName(teamNumber),
			this.getTeamColors(teamNumber),
			this.tba.getTeamAvatarForThisYear(teamNumber),
		]);

		const avatarUrl = avatarBase64 ? `data:image/png;base64,${avatarBase64?.toString('base64')}` : undefined;

		return {
			teamNumber,
			colors: teamColors,
			teamName,
			avatarUrl,
		};
	}
}

export const teamsService = new TeamsService(colorGenService, tbaService, savedColorsService);
