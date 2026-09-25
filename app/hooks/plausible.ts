import { usePlausible as baseUsePlausible } from 'next-plausible';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';

type PlausibleEvents = {
	'View team': { team: TeamNumber };
};

export const usePlausible = () => baseUsePlausible<PlausibleEvents>();
