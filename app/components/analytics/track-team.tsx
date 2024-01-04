'use client';

import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { usePlausible } from '@/app/hooks/plausible';
import { useEffect, useState } from 'react';
import { useDebounce } from 'use-debounce';

export default function TrackTeam({ teamNumber }: { teamNumber?: TeamNumberSchema }) {
	const plausible = usePlausible();
	const [previousTeamNumber, setPreviousTeamNumber] = useState<TeamNumberSchema>();

	const [debouncedTeamNumber] = useDebounce(teamNumber, 1500);

	useEffect(() => {
		if (debouncedTeamNumber && debouncedTeamNumber !== previousTeamNumber) {
			setPreviousTeamNumber(debouncedTeamNumber);
			plausible('View team', { props: { team: debouncedTeamNumber } });
		}
	}, [debouncedTeamNumber, previousTeamNumber, plausible]);

	return <></>;
}
