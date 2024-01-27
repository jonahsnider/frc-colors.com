import { z } from 'zod';

export const TeamNumber = z.coerce.number().positive().int().max(50_000);
export type TeamNumber = z.infer<typeof TeamNumber>;
