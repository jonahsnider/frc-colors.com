import { InternalTeamSchema } from '../api/_lib/internal/team/dtos/internal-team.dto';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import useSWR from 'swr';
import { fetcher } from '../swr';

export function useTeam(teamNumber?: TeamNumberSchema): {
	team: InternalTeamSchema | undefined;
	isLoading: boolean;
	error: unknown;
} {
	const {
		data: team,
		error,
		isLoading,
	} = useSWR<InternalTeamSchema>(`/api/internal/team/${teamNumber}`, {
		fetcher: teamNumber ? fetcher : undefined,
	});

	if (teamNumber === undefined) {
		return {
			team: undefined,
			isLoading: false,
			error: undefined,
		};
	}

	return {
		team,
		isLoading,
		error,
	};
}
