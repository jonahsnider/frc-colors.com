import { TeamColorsSchema } from '../colors/saved-colors/dtos/team-colors-dto';
import { TeamNumberSchema } from '../dtos/team-number.dto';

export type InternalTeam = {
	teamName?: string;
	avatarUrl?: string;
	teamNumber: TeamNumberSchema;
	colors?: TeamColorsSchema;
};
