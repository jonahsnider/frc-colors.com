import { usePlausible as baseUsePlausible } from 'next-plausible';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';

export type PlausibleEvents = {
	'View team': { team: TeamNumberSchema };
};

export const usePlausible = () => baseUsePlausible<PlausibleEvents>();
