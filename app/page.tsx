import { Metadata } from 'next';
import { BaseHttpException } from './api/_lib/exceptions/base.exception';
import { tbaService } from './api/_lib/tba/tba.service';
import { TeamNumberSchema, TeamNumberStringSchema } from './api/_lib/teams/dtos/team-number.dto';
import { teamsService } from './api/_lib/teams/teams.service';
import H1 from './components/headings/h1';
import TeamCard from './components/team-card/team-card';
import SearchTeams from '@/app/components/search-teams';
import { description, siteName } from '@/app/shared-metadata';
import { InternalTeamSchema } from './api/_lib/internal/team/dtos/internal-team.dto';

async function getInternalTeam(teamNumber: TeamNumberSchema): Promise<InternalTeamSchema> {
	const [teamName, colors, avatarBase64] = await Promise.all([
		teamsService.getTeamName(teamNumber),
		teamsService.getTeamColors(teamNumber),
		tbaService.getTeamAvatarForYear(teamNumber, new Date().getFullYear()),
	]);

	const avatarUrl = avatarBase64 ? `data:image/png;base64,${avatarBase64?.toString('base64')}` : undefined;

	return {
		teamNumber,
		teamName: teamName instanceof BaseHttpException ? undefined : teamName,
		avatarUrl,
		colors:
			colors instanceof BaseHttpException
				? undefined
				: {
						primaryHex: colors.primary,
						secondaryHex: colors.secondary,
						verified: colors.verified,
				  },
	};
}

type Props = {
	searchParams: { [key: string]: string | string[] | undefined };
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
	if (searchParams.team) {
		const teamNumber = TeamNumberSchema.parse(TeamNumberStringSchema.parse(searchParams.team));

		const team = await getInternalTeam(teamNumber);

		const images: string[] = [];

		if (team.avatarUrl) {
			images.push(`/api/opengraph/team/${teamNumber}/avatar`);
		}

		const teamName = team.teamName ? `${teamNumber} - ${team.teamName}` : `${teamNumber}`;

		const teamDescription = `See team ${teamName}'s branding colors and avatar`;
		return {
			title: `Team ${teamNumber} - ${siteName}`,
			description: teamDescription,
			openGraph: {
				title: `Team ${teamNumber}`,
				images,
				description: teamDescription,
				siteName,
				url: `/?team=${teamNumber}`,
			},
			themeColor: team.colors?.primaryHex,
		};
	}

	return {
		title: `Home - ${siteName}`,
		description,
		openGraph: {
			title: 'Home',
			siteName,
			description,
			url: '/',
		},
	};
}

export default async function TeamPage({ searchParams }: Props) {
	const teamNumber = searchParams.team
		? TeamNumberSchema.parse(TeamNumberStringSchema.parse(searchParams.team))
		: undefined;

	const team = teamNumber ? await getInternalTeam(teamNumber) : undefined;

	return (
		<main>
			<section id='search' className='w-full flex flex-col items-center text-center p-4'>
				<H1>FRC Colors</H1>

				<SearchTeams teamNumber={teamNumber} />

				{team && (
					<TeamCard
						teamNumber={team.teamNumber}
						avatarUrl={team.avatarUrl}
						colors={team.colors}
						teamName={team.teamName}
					/>
				)}
			</section>
		</main>
	);
}
