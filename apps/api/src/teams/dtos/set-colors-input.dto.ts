import { z } from 'zod';
import { TeamColors } from '../../colors/dtos/colors.dto';
import { TeamNumber } from './team-number.dto';

export const SetColorsInput = z.object({ team: TeamNumber, colors: TeamColors.omit({ verified: true }) });
export type SetColorsInput = z.infer<typeof SetColorsInput>;
