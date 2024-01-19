import { z } from 'zod';
import { TeamNumberSchema } from '../team-number.dto';
import { V0ColorsSchema } from '../v0/team.dto';

export const V1TeamSchema = z.object({
	teamNumber: TeamNumberSchema,
	colors: V0ColorsSchema,
});
export type V1TeamSchema = z.infer<typeof V1TeamSchema>;

export const V1FindManyTeamSchema = V1TeamSchema.extend({
	colors: V0ColorsSchema.nullable(),
});
export type V1FindManyTeamSchema = z.infer<typeof V1FindManyTeamSchema>;

export const V1FindManyTeamsSchema = z.object({
	teams: z.record(TeamNumberSchema, V1FindManyTeamSchema),
});
export type V1FindManyTeamsSchema = z.infer<typeof V1FindManyTeamsSchema>;
