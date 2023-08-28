import { ColorGenService, colorGenService } from './color-gen/color-gen.service';
import { TeamColors } from '../colors/interfaces/team-colors';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { HexColorCodeSchema } from '../colors/dtos/hex-color-code.dto';
import { TeamNotFoundException } from './exceptions/team-not-found.exception';
import { TbaService, tbaService } from '../tba/tba.service';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { NoTeamColorsException } from './exceptions/no-team-colors.exception';
import { InternalTeamSchema } from '../internal/team/dtos/internal-team.dto';
import { BaseHttpException } from '../exceptions/base.exception';

export class TeamsService {
	constructor(
		private readonly colorGen: ColorGenService,
		private readonly prisma: PrismaClient,
		private readonly tba: TbaService,
	) {}

	/** @returns The colors for a team. */
	async getTeamColors(
		teamNumber: TeamNumberSchema,
	): Promise<TeamColors | NoTeamColorsException | TeamNotFoundException> {
		const teamExistsException = await this.teamExists(teamNumber);

		if (teamExistsException) {
			return teamExistsException;
		}

		const savedTeamColors = await this.findSavedTeamColors(teamNumber);

		if (savedTeamColors) {
			return savedTeamColors;
		}

		const colors = await this.colorGen.getTeamColors(teamNumber);

		if (colors) {
			return colors;
		}

		return new NoTeamColorsException(teamNumber);
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

	async saveTeamColors(teamNumber: TeamNumberSchema, colors: Omit<TeamColors, 'verified'>): Promise<void> {
		const teamColor = { primaryColorHex: colors.primary, secondaryColorHex: colors.secondary };

		await this.prisma.team.upsert({
			where: {
				id: teamNumber,
			},
			update: {
				teamColor: {
					upsert: {
						create: teamColor,
						update: { primaryColorHex: colors.primary, secondaryColorHex: colors.secondary },
					},
				},
			},
			create: {
				id: teamNumber,
				teamColor: {
					create: teamColor,
				},
			},
		});
	}

	async getInternalTeam(teamNumber: TeamNumberSchema): Promise<InternalTeamSchema> {
		const [teamName, colors, avatarBase64] = await Promise.all([
			this.getTeamName(teamNumber),
			this.getTeamColors(teamNumber),
			this.tba.getTeamAvatarForThisYear(teamNumber),
		]);

		const avatarUrl = avatarBase64 ? `data:image/png;base64,${avatarBase64?.toString('base64')}` : undefined;

		return {
			teamNumber,
			teamName: teamName instanceof BaseHttpException ? undefined : teamName,
			avatarUrl,
			colors:
				colors instanceof BaseHttpException
					? undefined
					: {
							primaryHex: colors.primary,
							secondaryHex: colors.secondary,
							verified: colors.verified,
					  },
		};
	}

	private async findSavedTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColors | undefined> {
		const teamColors = await this.prisma.teamColor.findUnique({ where: { teamId: teamNumber } });

		if (teamColors) {
			return {
				primary: HexColorCodeSchema.parse(teamColors.primaryColorHex.toLowerCase()),
				secondary: HexColorCodeSchema.parse(teamColors.secondaryColorHex.toLowerCase()),
				verified: true,
			};
		}

		return undefined;
	}
}

export const teamsService = new TeamsService(colorGenService, prisma, tbaService);
