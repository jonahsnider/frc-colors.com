export type TbaTeam = {
	nickname?: string;
	name: string;

	team_number: number;
} & Record<string, unknown>;
