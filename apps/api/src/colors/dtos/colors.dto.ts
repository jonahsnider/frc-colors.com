import { z } from 'zod';
import { TeamNumber } from '../../teams/dtos/team-number.dto.ts';

export const HexColorCode = z.string().regex(/^#[\da-f]{6}$/);
export type HexColorCode = z.output<typeof HexColorCode>;

export const TeamColors = z.object({
	primary: HexColorCode,
	secondary: HexColorCode,
	verified: z.boolean(),
});
export type TeamColors = z.output<typeof TeamColors>;

export const ManyTeamColors = z.map(TeamNumber, TeamColors.optional());
export type ManyTeamColors = z.output<typeof ManyTeamColors>;
