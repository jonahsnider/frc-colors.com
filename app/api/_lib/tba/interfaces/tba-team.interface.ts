export type TbaTeam = {
	nickname?: string;
	name: string;
	// biome-ignore lint/style/useNamingConvention: Can't use camelcase here
	team_number: number;
} & Record<string, unknown>;
