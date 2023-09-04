import { TeamNumberSchema } from '../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';

export type InternalTeam = {
	teamName?: string;
	avatarUrl?: string;
	teamNumber: TeamNumberSchema;
	colors?: TeamColorsSchema;
};
