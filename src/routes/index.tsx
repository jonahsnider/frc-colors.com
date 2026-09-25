import { convexQuery } from '@convex-dev/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Heading, Section } from '@radix-ui/themes';
import { useContext } from 'react';
import { useDebounce } from 'use-debounce';
import { AdminTeamSummary } from '@/app/components/admin/admin-team-summary';
import { TrackTeam } from '@/app/components/analytics/track-team';
import { SearchTeams } from '@/app/components/search-teams';
import { TeamCard } from '@/app/components/team-card/team-card';
import { TeamNumberContext, TeamNumberProvider } from '@/app/contexts/team-number-context';
import { useApiKey } from '@/app/hooks/use-api-key';
import { useTeamName } from '@/app/hooks/use-team-name';
import { api } from '@/convex/_generated/api';
import { TeamNumber } from '@/src/teams/dtos/team-number.dto';

export const Route = createFileRoute('/')({
	validateSearch: (search): { team?: number } => {
		const parsed = TeamNumber.safeParse(search.team);
		return { team: parsed.success ? parsed.data : undefined };
	},
	loaderDeps: ({ search }) => ({ team: search.team }),
	loader: async ({ deps, context: { queryClient } }) => {
		if (deps.team === undefined || typeof window !== 'undefined') return null;
		// Keep the page renderable if Convex is temporarily unavailable.
		await Promise.allSettled([
			queryClient.query(convexQuery(api.teamNames.get, { team: deps.team })),
			queryClient.query(convexQuery(api.colors.getOne, { team: deps.team })),
		]);
	},
	component: HomeRoute,
});

function HomeRoute() {
	return (
		<Section id='search' py='4' className='flex flex-col gap-rx-6 items-center grow'>
			<Heading size='8' as='h1' className='[view-transition-name:page-title]'>
				FRC Colors
			</Heading>
			<TeamNumberProvider>
				<HomePage />
			</TeamNumberProvider>
		</Section>
	);
}

function HomePage() {
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
