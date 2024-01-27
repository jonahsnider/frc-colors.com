import { inArray } from 'drizzle-orm';
import { db } from '../../db/db';
import { Schema } from '../../db/index';
import { TeamNumber } from '../../teams/dtos/team-number.dto';
import { HexColorCode, ManyTeamColors, TeamColors } from '../dtos/colors.dto';
import { ColorFetcher } from '../interfaces/color-fetcher.interface';

export class StoredColors implements ColorFetcher {
	async getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	async getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
	async getTeamColors(teamOrTeams: TeamNumber | TeamNumber[]): Promise<TeamColors | ManyTeamColors | undefined> {
		const teams = Array.isArray(teamOrTeams) ? teamOrTeams : [teamOrTeams];

		if (teams.length === 0) {
			return new Map();
		}

		const teamColors = await db.query.teamColors.findMany({
			where: inArray(Schema.teamColors.teamId, teams),
			columns: {
				teamId: true,
				primaryColorHex: true,
				secondaryColorHex: true,
				verified: true,
			},
		});

		if (Array.isArray(teamOrTeams)) {
			const result: ManyTeamColors = new Map();

			for (const colors of teamColors) {
				result.set(colors.teamId, {
					primary: HexColorCode.parse(colors.primaryColorHex.toLowerCase()),
					secondary: HexColorCode.parse(colors.secondaryColorHex.toLowerCase()),
					verified: colors.verified,
				});
			}

			for (const team of teams) {
				if (!result.has(team)) {
					result.set(team, undefined);
				}
			}

			return result;
		}

		const [teamColor] = teamColors;

		if (!teamColor) {
			return undefined;
		}

		return {
			primary: HexColorCode.parse(teamColor.primaryColorHex.toLowerCase()),
			secondary: HexColorCode.parse(teamColor.secondaryColorHex.toLowerCase()),
			verified: teamColor.verified,
		};
	}

	async setTeamColors(team: TeamNumber, colors: TeamColors): Promise<void> {
		const teamColor = {
			primaryColorHex: colors.primary,
			secondaryColorHex: colors.secondary,
			verified: colors.verified,
		};

		await db.transaction(async (tx) => {
			await tx.insert(Schema.teams).values({ id: team }).onConflictDoNothing();

			await tx
				.insert(Schema.teamColors)
				.values({ teamId: team, ...teamColor })
				.onConflictDoUpdate({
					target: Schema.teamColors.teamId,
					set: { ...teamColor, updatedAt: new Date() },
				});
		});
	}
}

export const storedColors = new StoredColors();
