'use client';

import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { usePlausible } from '@/app/hooks/plausible';

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
