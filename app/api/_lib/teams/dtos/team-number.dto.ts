import { z } from 'zod';

export const TeamNumberSchema = z.number().positive().int();
export type TeamNumberSchema = z.infer<typeof TeamNumberSchema>;

export const TeamNumberStringSchema = z.string().regex(/^\d+$/).transform(Number);
export type TeamNumberStringSchema = z.infer<typeof TeamNumberStringSchema>;
