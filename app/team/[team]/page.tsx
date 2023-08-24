import { Metadata } from 'next';
import { BaseHttpException } from '../../api/_lib/exceptions/base.exception';
import { tbaService } from '../../api/_lib/tba/tba.service';
import { TeamNumberSchema, TeamNumberStringSchema } from '../../api/_lib/teams/dtos/team-number.dto';
import { teamsService } from '../../api/_lib/teams/teams.service';
import H1 from '../../components/headings/h1';
import TeamCard from '../../components/team-card/team-card';
import SearchTeams from '@/app/components/search-teams';

async function getInternalTeam(teamNumber: TeamNumberSchema) {
	const [teamName, colors, avatarBase64] = await Promise.all([
		teamsService.getTeamName(teamNumber),
		teamsService.getTeamColors(teamNumber),
		tbaService.getTeamAvatarForYear(teamNumber, new Date().getFullYear()),
	]);

	const avatarUrl = avatarBase64 ? `data:image/png;base64,${avatarBase64?.toString('base64')}` : undefined;

	if (teamName instanceof BaseHttpException) {
		return {
			teamNumber,
			teamName: undefined,
			avatarUrl,
			colors: undefined,
		};
	}

	if (colors instanceof BaseHttpException) {
		return {
			teamNumber,
			teamName: undefined,
			avatarUrl,
			colors: undefined,
		};
	}

	return {
		teamNumber,
		teamName,
		avatarUrl,
		colors: {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		},
	};
}

type Props = {
	params: {
		team: string;
	};
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
	const teamNumber = TeamNumberSchema.parse(TeamNumberStringSchema.parse(params.team));

	const team = await getInternalTeam(teamNumber);

	const images: string[] = [];

	if (team.avatarUrl) {
		images.push(team.avatarUrl);
	}

	return {
		title: `FRC Colors - Team ${teamNumber}`,
		openGraph: {
			images,
		},
	};
}

export default async function TeamPage({ params }: Props) {
	const teamNumber = TeamNumberSchema.parse(TeamNumberStringSchema.parse(params.team));

	const team = await getInternalTeam(teamNumber);

	return (
		<main>
			<section id='search' className='w-full flex flex-col items-center text-center p-4'>
				<H1>FRC Colors</H1>

				<SearchTeams teamNumber={teamNumber} />

				<TeamCard teamNumber={teamNumber} avatarUrl={team.avatarUrl} colors={team.colors} teamName={team.teamName} />
			</section>
		</main>
	);
}
