'use client';

import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import { usePlausible } from '@/app/hooks/plausible';
import { useEffect } from 'react';

export default function TrackTeam({ teamNumber }: { teamNumber?: TeamNumberSchema }) {
	const plausible = usePlausible();

	useEffect(() => {
		if (teamNumber) {
			plausible('View team', { props: { team: teamNumber } });
		}
	}, [teamNumber]);

	return <></>;
}
