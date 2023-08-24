import { ColorGenService, colorGenService } from './color-gen/color-gen.service';
import { TeamColors } from '../colors/interfaces/team-colors';
import { PrismaClient } from '@prisma/client';
import { prisma } from '../prisma';
import { HexColorCodeSchema } from '../colors/dtos/hex-color-code.dto';
import { TeamNotFoundException } from './exceptions/team-not-found.exception';
import { TbaService, tbaService } from '../tba/tba.service';
import { TeamNumberSchema } from './dtos/team-number.dto';
import { NoTeamColorsException } from './exceptions/no-team-colors.exception';

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

		const currentYear = new Date().getFullYear();
		const yearsToCheck = [currentYear, currentYear - 1];

		for (const year of yearsToCheck) {
			const colors = await this.colorGen.getTeamColorsForYear(teamNumber, year);

			if (colors) {
				return colors;
			}
		}

		return new NoTeamColorsException(teamNumber, yearsToCheck);
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

	private async findSavedTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColors | undefined> {
		const teamColors = await this.prisma.teamColor.findUnique({ where: { teamId: teamNumber } });

		if (teamColors) {
			return {
				primary: HexColorCode.parse(teamColors.primaryColorHex.toLowerCase()),
				secondary: HexColorCode.parse(teamColors.secondaryColorHex.toLowerCase()),
				verified: true,
			};
		}

		return undefined;
	}
}

export const teamsService = new TeamsService(colorGenService, prisma, tbaService);
