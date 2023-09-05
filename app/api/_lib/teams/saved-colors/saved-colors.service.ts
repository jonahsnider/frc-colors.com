import { PrismaClient } from '@prisma/client';
import { prisma } from '../../prisma';
import { TeamNumberSchema } from '../dtos/team-number.dto';
import { HexColorCodeSchema } from './dtos/hex-color-code.dto';
import { TeamColorsSchema } from './dtos/team-colors-dto';

export class SavedColorsService {
	constructor(private readonly prisma: PrismaClient) {}

	async findTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined>;
	async findTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, TeamColorsSchema>>;
	async findTeamColors(
		teamNumber: TeamNumberSchema | TeamNumberSchema[],
	): Promise<TeamColorsSchema | undefined | Map<TeamNumberSchema, TeamColorsSchema>> {
		if (typeof teamNumber === 'number') {
			return this.findOneTeamColors(teamNumber);
		}

		return this.findManyTeamColors(teamNumber);
	}

	async saveTeamColors(
		teamNumber: TeamNumberSchema,
		colors: Pick<TeamColorsSchema, 'primary' | 'secondary'>,
	): Promise<void> {
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

	private async findManyTeamColors(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, TeamColorsSchema>> {
		const teamColors = await this.prisma.teamColor.findMany({
			where: { teamId: { in: teamNumbers } },
		});

		return new Map(
			teamColors.map((teamColor) => [
				teamColor.teamId,
				{
					primary: HexColorCodeSchema.parse(teamColor.primaryColorHex.toLowerCase()),
					secondary: HexColorCodeSchema.parse(teamColor.secondaryColorHex.toLowerCase()),
					verified: true,
				},
			]),
		);
	}

	private async findOneTeamColors(teamNumber: TeamNumberSchema): Promise<TeamColorsSchema | undefined> {
		const teamColors = await this.prisma.teamColor.findUnique({
			where: { teamId: teamNumber },
		});

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

export const savedColorsService = new SavedColorsService(prisma);
