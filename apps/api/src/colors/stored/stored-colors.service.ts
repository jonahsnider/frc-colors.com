import { eq, inArray } from 'drizzle-orm';

import { db } from '../../db/db';
import { Schema } from '../../db/index';
import type { TeamNumber } from '../../teams/dtos/team-number.dto';
import { trackDuration } from '../../timing/timing';
import { HexColorCode, type ManyTeamColors, type TeamColors } from '../dtos/colors.dto';
import type { ColorFetcher } from '../interfaces/color-fetcher.interface';

export class StoredColors implements ColorFetcher {
	async getTeamColors(team: TeamNumber): Promise<TeamColors | undefined>;
	async getTeamColors(teams: TeamNumber[]): Promise<ManyTeamColors>;
	async getTeamColors(teamOrTeams: TeamNumber | TeamNumber[]): Promise<TeamColors | ManyTeamColors | undefined> {
		const teams = Array.isArray(teamOrTeams) ? teamOrTeams : [teamOrTeams];

		if (teams.length === 0) {
			return new Map();
		}

		const teamColors = await trackDuration(
			'db',
			'colors',
			db.query.teamColors.findMany({
				where: inArray(Schema.teamColors.team, teams),
				columns: {
					team: true,
					primaryHex: true,
					secondaryHex: true,
					verified: true,
				},
			}),
		);

		if (Array.isArray(teamOrTeams)) {
			const result: ManyTeamColors = new Map();

			for (const colors of teamColors) {
				result.set(colors.team, {
					primary: HexColorCode.parse(colors.primaryHex.toLowerCase()),
					secondary: HexColorCode.parse(colors.secondaryHex.toLowerCase()),
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
			primary: HexColorCode.parse(teamColor.primaryHex.toLowerCase()),
			secondary: HexColorCode.parse(teamColor.secondaryHex.toLowerCase()),
			verified: teamColor.verified,
		};
	}

	async getAllTeamColors(): Promise<ManyTeamColors> {
		const teamColors = await trackDuration(
			'db',
			'all colors',
			db.query.teamColors.findMany({
				columns: {
					team: true,
					primaryHex: true,
					secondaryHex: true,
					verified: true,
				},
			}),
		);

		return new Map(
			teamColors.map((colors) => [
				colors.team,
				{
					primary: HexColorCode.parse(colors.primaryHex.toLowerCase()),
					secondary: HexColorCode.parse(colors.secondaryHex.toLowerCase()),
					verified: colors.verified,
				},
			]),
		);
	}

	async setTeamColors(team: TeamNumber, colors: TeamColors): Promise<void> {
		const teamColor = {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		} satisfies Partial<typeof Schema.teamColors.$inferSelect>;

		await db.transaction(async (tx) => {
			await tx.insert(Schema.teams).values({ number: team }).onConflictDoNothing();

			await tx
				.insert(Schema.teamColors)
				.values({ team, ...teamColor })
				.onConflictDoUpdate({
					target: Schema.teamColors.team,
					set: { ...teamColor, updatedAt: new Date() },
				});
		});
	}

	async deleteTeamColors(team: TeamNumber): Promise<void> {
		await db.delete(Schema.teamColors).where(eq(Schema.teamColors.team, team)).execute();
	}

	async isVerified(team: TeamNumber): Promise<boolean | undefined> {
		const row = await db.query.teamColors.findFirst({
			columns: {
				verified: true,
			},
			where: eq(Schema.teamColors.team, team),
		});

		return row?.verified;
	}
}
