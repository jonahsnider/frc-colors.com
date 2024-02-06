import { TeamNumber } from '../../teams/dtos/team-number.dto';

export type TeamColorsHttp = {
	primaryHex: string;
	secondaryHex: string;
	verified: boolean;
};

export type ManyTeamColorsHttp = {
	teams: Record<TeamNumber, TeamColorsHttp | null>;
};
