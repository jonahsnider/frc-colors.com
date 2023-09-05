'use client';

import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { usePlausible } from '@/app/hooks/plausible';
import { useEffect, useState } from 'react';

export default function TrackTeam({ teamNumber }: { teamNumber?: TeamNumberSchema }) {
	const plausible = usePlausible();
	const [previousTeamNumber, setPreviousTeamNumber] = useState<TeamNumberSchema>();

	useEffect(() => {
		if (teamNumber && teamNumber !== previousTeamNumber) {
			setPreviousTeamNumber(teamNumber);
			plausible('View team', { props: { team: teamNumber } });
		}
	}, [teamNumber, previousTeamNumber, plausible]);

	return <></>;
}
