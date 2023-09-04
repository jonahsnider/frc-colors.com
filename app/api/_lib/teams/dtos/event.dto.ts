import { z } from 'zod';
import { TeamSchema } from './team.dto';

export const FindManyTeamsByEventSchema = z.object({
	teams: z.array(TeamSchema),
});
export type FindManyTeamsByEventSchema = z.infer<typeof FindManyTeamsByEventSchema>;
