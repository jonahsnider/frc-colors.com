import { TeamNumber } from '../../teams/dtos/team-number.dto';

export type TeamColorsHttp = {
	primaryHex: string;
	secondaryHex: string;
	verified: boolean;
};

export type ManyTeamColorsHttpEntry = {
	colors: TeamColorsHttp | null;
	teamNumber: TeamNumber;
};

export type ManyTeamColorsHttp = {
	teams: Record<TeamNumber, ManyTeamColorsHttpEntry>;
};
