import { z } from 'zod';

export const TeamNumberSchema = z
	.string()
	.regex(/^\d+$/)
	.or(z.number())
	.transform(Number)
	.pipe(z.number().positive().int().max(50_000));
export type TeamNumberSchema = z.infer<typeof TeamNumberSchema>;
