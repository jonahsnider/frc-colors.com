'use client';

import { useContext } from 'react';
import SearchTeams from '../components/search-teams';
import TeamCard from '../components/team-card/team-card';
import { TeamNumberContext } from '../contexts/team-number-context';
import { useTeam } from '../hooks/use-team';
import LoadingTeamCard from '../components/team-card/loading-team-card';
import TrackTeam from '../components/analytics/track-team';

export default function HomePage() {
	const { teamNumber } = useContext(TeamNumberContext);

	const { team, error, isLoading } = useTeam(teamNumber);

	return (
		<>
			<SearchTeams />

			<TrackTeam teamNumber={teamNumber} />

			{team && (
				<TeamCard
					teamNumber={team.teamNumber}
					avatarUrl={team.avatarUrl}
					colors={team.colors}
					teamName={team.teamName}
				/>
			)}
			{error && <p>An error occurred while fetching team {teamNumber}'s information</p>}
			{isLoading && <LoadingTeamCard />}
		</>
	);
}
