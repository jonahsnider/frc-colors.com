'use client';

import { useContext } from 'react';
import AdminTeamSummary from '../components/admin/admin-team-summary';
import TrackTeam from '../components/analytics/track-team';
import SearchTeams from '../components/search-teams';
import LoadingTeamCard from '../components/team-card/loading-team-card';
import TeamCard from '../components/team-card/team-card';
import { TeamNumberContext } from '../contexts/team-number-context';
import { useTeam } from '../hooks/use-team';
import VerificationRequestButton from './verification-request-button';

export default function HomePage() {
	const { teamNumber } = useContext(TeamNumberContext);

	const { team, error, isLoading } = useTeam(teamNumber);

	const teamExists = isLoading || Boolean(team?.teamName);

	return (
		<>
			<SearchTeams invalidTeam={!teamExists} />

			<TrackTeam teamNumber={teamNumber} />

			{team && (
				<TeamCard
					teamNumber={team.teamNumber}
					avatarUrl={team.avatarUrl ?? undefined}
					colors={team.colors ?? undefined}
					teamName={team.teamName ?? undefined}
					actions={teamExists && !team.colors?.verified && <VerificationRequestButton team={team} />}
				/>
			)}
			{error && <p>An error occurred while fetching team {teamNumber}'s information</p>}
			{isLoading && <LoadingTeamCard />}

			<AdminTeamSummary team={team} />
		</>
	);
}
