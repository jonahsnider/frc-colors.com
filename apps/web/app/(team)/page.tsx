'use client';

import { useContext } from 'react';
import { useDebounce } from 'use-debounce';
import { AdminTeamSummary } from '../components/admin/admin-team-summary';
import { TrackTeam } from '../components/analytics/track-team';
import { SearchTeams } from '../components/search-teams';
import { TeamCard } from '../components/team-card/team-card';
import { TeamNumberContext } from '../contexts/team-number-context';
import { useApiKey } from '../hooks/use-api-key';
import { trpc } from '../trpc';

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function HomePage() {
	const { teamNumber } = useContext(TeamNumberContext);
	const [apiKey] = useApiKey();

	const [debouncedTeam] = useDebounce(teamNumber, 100, { maxWait: 1000 });

	// biome-ignore lint/style/noNonNullAssertion: This won't run if teamNumber isn't defined
	const teamNameQuery = trpc.teams.getName.useQuery(debouncedTeam!, { enabled: Boolean(teamNumber) });

	const teamExists = teamNameQuery.isSuccess ? Boolean(teamNameQuery.data?.name) : true;

	return (
		<>
			<SearchTeams invalidTeam={!teamExists} />

			<TrackTeam teamNumber={debouncedTeam} />

			{debouncedTeam && <TeamCard teamNumber={debouncedTeam} />}

			{apiKey && <AdminTeamSummary teamNumber={debouncedTeam} />}
		</>
	);
}
