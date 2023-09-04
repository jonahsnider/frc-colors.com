import { TeamNumberSchema } from '../dtos/team-number.dto';
import { TeamColorsSchema } from '../saved-colors/dtos/team-colors-dto';

export type FindManyTeams = Map<TeamNumberSchema, TeamColorsSchema | undefined>;
