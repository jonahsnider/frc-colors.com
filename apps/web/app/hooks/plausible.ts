import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { usePlausible as baseUsePlausible } from 'next-plausible';

export type PlausibleEvents = {
	'View team': { team: TeamNumber };
};

export const usePlausible = () => baseUsePlausible<PlausibleEvents>();
