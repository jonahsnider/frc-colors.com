'use client';

import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';

export function useTeamName(teamNumber: number | undefined) {
	const result = useQuery(api.teamNames.get, teamNumber === undefined ? 'skip' : { team: teamNumber });
	return {
		name: result?.name,
		isPending: teamNumber !== undefined && result === undefined,
	};
}
