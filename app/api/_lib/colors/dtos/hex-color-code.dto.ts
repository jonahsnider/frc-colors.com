import { z } from 'zod';

export const HexColorCode = z.string().regex(/^#[\da-f]{6}$/);
export type HexColorCode = z.infer<typeof HexColorCode>;
