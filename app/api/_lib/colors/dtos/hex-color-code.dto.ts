import { z } from 'zod';

export const HexColorCodeSchema = z.string().regex(/^#[\da-f]{6}$/);
export type HexColorCodeSchema = z.infer<typeof HexColorCodeSchema>;
