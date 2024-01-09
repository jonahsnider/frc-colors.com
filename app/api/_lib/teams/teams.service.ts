import { getTeamAvatarUrl } from '@/app/components/util/team-avatar-url';
import * as Sentry from '@sentry/nextjs';
import { TbaService, tbaService } from '../tba/tba.service';
import { AvatarsService, avatarsService } from './avatars/avatars.service';
import { ColorsService, colorsService } from './colors/colors.service';
import { TeamColorsSchema } from './colors/saved-colors/dtos/team-colors-dto';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { FindManyTeams } from './interfaces/find-many-teams.interface';
import { InternalTeam } from './interfaces/internal-team';

export class TeamsService {
	constructor(
		private readonly colors: ColorsService,
		private readonly tba: TbaService,
		private readonly avatars: AvatarsService,
		// biome-ignore lint/nursery/noEmptyBlockStatements: This has parameter properties
	) {}

	/** @returns The team's nickname or name (nickname is used if available). */
	async getTeamName(teamNumber: TeamNumberSchema): Promise<string | undefined> {
		return Sentry.startSpan({ name: 'Get team name', op: 'function' }, async () => {
			return this.tba.getTeamName(teamNumber);
		});
	}

	async getInternalTeam(teamNumber: TeamNumberSchema): Promise<InternalTeam> {
		return Sentry.startSpan({ name: 'Get internal team', op: 'function' }, async () => {
			const [teamName, teamColors] = await Promise.all([
				this.getTeamName(teamNumber),
				this.colors.getTeamColors(teamNumber),
			]);

			const avatarUrl = getTeamAvatarUrl(teamNumber);

			return {
				teamNumber,
				colors: teamColors,
				teamName,
				avatarUrl,
			};
		});
	}

	async getManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<FindManyTeams> {
		return this.colors.getManyTeamColors(teamNumbers);
	}

	async getTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		return this.colors.getTeamColors(teamNumber);
	}

	async getTeamColorsForEvent(eventCode: string): Promise<FindManyTeams> {
		return Sentry.startSpan({ name: 'Get team colors for event', op: 'function' }, async () => {
			const teams = await this.tba.getTeamsForEvent(eventCode);

			return this.getManyTeamColors(teams);
		});
	}
}

export const teamsService = new TeamsService(colorsService, tbaService, avatarsService);
