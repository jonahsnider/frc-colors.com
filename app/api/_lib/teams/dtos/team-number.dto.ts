import { z } from 'zod';

export const TeamNumberSchema = z
	.union([z.string().regex(/^\d+$/).transform(Number), z.number()])
	.pipe(z.number().positive().int().max(50_000));
export type TeamNumberSchema = z.infer<typeof TeamNumberSchema>;
