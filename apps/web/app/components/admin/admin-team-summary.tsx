'use client';

import { VerificationRequestsTable } from './verification-requests/table';

import { trpc } from '@/app/trpc';
import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { Card, Heading } from '@radix-ui/themes';
import { ColorSubmissionsTable } from './color-submissions/table';

type Props = {
	teamNumber: TeamNumber | undefined;
};

export function AdminTeamSummary({ teamNumber }: Props) {
	if (!teamNumber) {
		return <></>;
	}

	return (
		<div className='flex flex-col gap-4 pt-8 w-full md:w-auto'>
			<Heading as='h2' size='6'>
				Admin data
			</Heading>

			<div className='flex flex-col md:flex-row md:justify-between gap-rx-6'>
				<VerificationRequests teamNumber={teamNumber} />

				<ColorSubmissions teamNumber={teamNumber} />
			</div>
		</div>
	);
}

function VerificationRequests({ teamNumber }: { teamNumber: TeamNumber }) {
	const verificationRequests = trpc.verificationRequests.getAllForTeam.useQuery(teamNumber);

	return (
		<Card className='flex flex-col gap-2'>
			<Heading as='h3' size='5'>
				Verification requests
			</Heading>
			{verificationRequests.data && <VerificationRequestsTable requests={verificationRequests.data} />}
			{verificationRequests.error && <p>An error occurred while fetching verification requests</p>}
			{verificationRequests.isLoading && <p>Fetching verification requests...</p>}
		</Card>
	);
}

function ColorSubmissions({ teamNumber }: { teamNumber: TeamNumber }) {
	const colorSubmissions = trpc.colorSubmissions.getAllForTeam.useQuery(teamNumber);

	return (
		<Card className='flex flex-col gap-2'>
			<Heading as='h3' size='5'>
				Color submissions
			</Heading>
			{colorSubmissions.data && <ColorSubmissionsTable colorSubmissions={colorSubmissions.data} />}
			{colorSubmissions.error && <p>An error occurred while fetching color submissions</p>}
			{colorSubmissions.isLoading && <p>Fetching color submissions...</p>}
		</Card>
	);
}
