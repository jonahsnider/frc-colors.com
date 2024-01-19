import { TeamColorsSchema } from '../colors/saved-colors/dtos/team-colors-dto';
import { TeamNumberSchema } from '../dtos/team-number.dto';

export type FindManyTeams = Map<TeamNumberSchema, TeamColorsSchema | undefined>;
