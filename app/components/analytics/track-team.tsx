import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { usePlausible } from '@/app/hooks/plausible';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';

export function TrackTeam({ teamNumber }: { teamNumber?: TeamNumber }) {
	const plausible = usePlausible();
	const [previousTeamNumber, setPreviousTeamNumber] = useState<TeamNumber>();

	const [debouncedTeamNumber] = useDebounce(teamNumber, 1500);

	useEffect(() => {
		if (debouncedTeamNumber && debouncedTeamNumber !== previousTeamNumber) {
			setPreviousTeamNumber(debouncedTeamNumber);
			plausible('View team', { props: { team: debouncedTeamNumber } });
		}
	}, [debouncedTeamNumber, previousTeamNumber, plausible]);

	return undefined;
}
