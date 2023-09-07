export type TbaTeam = {
	nickname?: string;
	name: string;
	// biome-ignore lint/nursery/useNamingConvention: Can't use camelcase here
	team_number: number;
} & Record<string, unknown>;
