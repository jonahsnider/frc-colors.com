'use client';

import { useContext } from 'react';
import { useDebounce } from 'use-debounce';
import { AdminTeamSummary } from '../components/admin/admin-team-summary';
import { TrackTeam } from '../components/analytics/track-team';
import { SearchTeams } from '../components/search-teams';
import { TeamCard } from '../components/team-card/team-card';
import { TeamNumberContext } from '../contexts/team-number-context';
import { useApiKey } from '../hooks/use-api-key';
import { useTeamName } from '../hooks/use-team-name';

export default function HomePage() {
	const { teamNumber } = useContext(TeamNumberContext);
	const [apiKey] = useApiKey();

	const [debouncedTeam] = useDebounce(teamNumber, 100, { maxWait: 1000 });

	const teamName = useTeamName(debouncedTeam);
	const teamExists = debouncedTeam === undefined || teamName.isPending || Boolean(teamName.name);

	return (
		<>
			<SearchTeams invalidTeam={!teamExists} />

			<TrackTeam teamNumber={debouncedTeam} />

			{debouncedTeam && <TeamCard teamNumber={debouncedTeam} className='[view-transition-name:main-card]' />}

			{apiKey && <AdminTeamSummary teamNumber={debouncedTeam} />}
		</>
	);
}
