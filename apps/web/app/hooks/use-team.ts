import useSwr, { KeyedMutator } from 'swr';
import { InternalTeamSchema } from '../api/_lib/internal/team/dtos/internal-team.dto';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { fetcher } from '../swr';

export function useTeam(teamNumber?: TeamNumberSchema): {
	team: InternalTeamSchema | undefined;
	isLoading: boolean;
	error: unknown;
	mutate: KeyedMutator<InternalTeamSchema> | undefined;
} {
	const {
		data: team,
		error,
		isLoading,
		mutate,
	} = useSwr<InternalTeamSchema>(`/api/internal/team/${teamNumber}`, {
		fetcher: teamNumber ? fetcher : undefined,
	});

	if (teamNumber === undefined) {
		return {
			team: undefined,
			isLoading: false,
			error: undefined,
			mutate: undefined,
		};
	}

	return {
		team,
		isLoading,
		error,
		mutate,
	};
}
