'use client';

import { Suspense, useContext } from 'react';
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

	// biome-ignore lint/style/noNonNullAssertion: This won't run if teamNumber isn't defined
	const teamNameQuery = trpc.teams.getName.useQuery(teamNumber!, { enabled: Boolean(teamNumber) });

	const teamExists = Boolean(teamNameQuery.data?.name) || teamNameQuery.isLoading;

	return (
		<>
			<Suspense>
				<SearchTeams invalidTeam={!teamExists} />
			</Suspense>

			<TrackTeam teamNumber={teamNumber} />

			{teamNumber && <TeamCard teamNumber={teamNumber} />}

			{apiKey && <AdminTeamSummary teamNumber={teamNumber} />}
		</>
	);
}
