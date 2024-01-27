import { TeamNumber } from '../../teams/dtos/team-number.dto';

export type TeamColorsHttp = {
	primaryHex: string;
	secondaryHex: string;
	verified: boolean;
};

export type ManyTeamColorsHttp = {
	colors: Record<TeamNumber, TeamColorsHttp | null>;
};
