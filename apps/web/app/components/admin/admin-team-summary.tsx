'use client';

import H2 from '../headings/h2';
import VerificationRequestsTable from './verification-requests/table';

import { trpc } from '@/app/trpc';
import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import H3 from '../headings/h3';
import ColorSubmissionsTable from './color-submissions/table';

type Props = {
	teamNumber: TeamNumber | undefined;
};

export default function AdminTeamSummary({ teamNumber }: Props) {
	if (!teamNumber) {
		return <></>;
	}

	return (
		<div className='flex flex-col gap-4 pt-8 w-full md:w-auto'>
			<H2>Admin data</H2>

			<div className='flex flex-col md:flex-row gap-4 md:gap-16'>
				<VerificationRequests teamNumber={teamNumber} />

				<ColorSubmissions teamNumber={teamNumber} />
			</div>
		</div>
	);
}

function VerificationRequests({ teamNumber }: { teamNumber: TeamNumber }) {
	const verificationRequests = trpc.verificationRequests.getAllForTeam.useQuery(teamNumber);

	return (
		<div className='flex flex-col gap-2'>
			<H3>Verification requests</H3>
			{verificationRequests.data && <VerificationRequestsTable requests={verificationRequests.data} />}
			{verificationRequests.error && <p>An error occurred while fetching verification requests</p>}
			{verificationRequests.isLoading && <p>Fetching verification requests...</p>}
		</div>
	);
}

function ColorSubmissions({ teamNumber }: { teamNumber: TeamNumber }) {
	const colorSubmissions = trpc.colorSubmissions.getAllForTeam.useQuery(teamNumber);

	return (
		<div className='flex flex-col gap-2'>
			<H3>Color submissions</H3>
			{colorSubmissions.data && <ColorSubmissionsTable colorSubmissions={colorSubmissions.data} />}
			{colorSubmissions.error && <p>An error occurred while fetching color submissions</p>}
			{colorSubmissions.isLoading && <p>Fetching color submissions...</p>}
		</div>
	);
}
