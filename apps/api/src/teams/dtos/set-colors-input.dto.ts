import { z } from 'zod';
import { TeamColors } from '../../colors/dtos/colors.dto.ts';
import { TeamNumber } from './team-number.dto.ts';

export const SetColorsInput = z.object({ team: TeamNumber, colors: TeamColors.omit({ verified: true }) });
export type SetColorsInput = z.output<typeof SetColorsInput>;
