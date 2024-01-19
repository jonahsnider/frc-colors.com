'use client';

import { useContext } from 'react';
import AdminTeamSummary from '../components/admin/admin-team-summary';
import TrackTeam from '../components/analytics/track-team';
import SearchTeams from '../components/search-teams';
import TeamCard from '../components/team-card/team-card';
import { getTeamAvatarUrl } from '../components/util/team-avatar-url';
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

			{teamNumber && !error && (
				<TeamCard
					teamNumber={teamNumber}
					avatarUrl={getTeamAvatarUrl(teamNumber)}
					colors={team?.colors ?? undefined}
					teamName={team?.teamName ?? undefined}
					actions={teamExists && !team?.colors?.verified && team && <VerificationRequestButton team={team} />}
					isLoading={isLoading}
				/>
			)}
			{error && <p>An error occurred while fetching team {teamNumber}'s information</p>}

			<AdminTeamSummary teamNumber={teamNumber} />
		</>
	);
}
