import { convexQuery } from '@convex-dev/react-query';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/convex/_generated/api';

export function useTeamName(teamNumber: number | undefined) {
	const result = useQuery(convexQuery(api.teamNames.get, teamNumber === undefined ? 'skip' : { team: teamNumber }));
	return {
		name: result.data?.name,
		isPending: teamNumber !== undefined && result.isPending,
	};
}
