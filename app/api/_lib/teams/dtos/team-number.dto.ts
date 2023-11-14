import { z } from 'zod';

export const TeamNumberSchema = z
	.union([
		z.string().regex(/^\d+$/).transform(Number),
		z.number(),
		// For some reason, Statbotics has started including a 10000001 team at the end of their requests
		// It can just be ignored on our end
		z.literal(10000001),
	])
	.pipe(z.number().positive().int().max(50_000));
export type TeamNumberSchema = z.infer<typeof TeamNumberSchema>;
