import { Card, Heading } from '@radix-ui/themes';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { useApiKey } from '@/app/hooks/use-api-key';
import { api } from '@/convex/_generated/api';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';
import { ColorSubmissionsTable } from './color-submissions/table';
import { VerificationRequestsTable } from './verification-requests/table';

type Props = {
	teamNumber: TeamNumber | undefined;
};

export function AdminTeamSummary({ teamNumber }: Props) {
	if (!teamNumber) {
		return undefined;
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
	const [password] = useApiKey();
	const [cutoff] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
	const verificationRequests = useQuery(
		api.verificationRequests.list,
		password ? { password, team: teamNumber, cutoff } : 'skip',
	);

	return (
		<Card className='flex flex-col gap-2'>
			<Heading as='h3' size='5'>
				Verification requests
			</Heading>
			{verificationRequests && <VerificationRequestsTable requests={verificationRequests} />}
			{verificationRequests === null && <p>Invalid API key</p>}
			{verificationRequests === undefined && <p>Fetching verification requests...</p>}
		</Card>
	);
}

function ColorSubmissions({ teamNumber }: { teamNumber: TeamNumber }) {
	const [password] = useApiKey();
	const [cutoff] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
	const colorSubmissions = useQuery(
		api.colorSubmissions.list,
		password ? { password, team: teamNumber, cutoff } : 'skip',
	);

	return (
		<Card className='flex flex-col gap-2'>
			<Heading as='h3' size='5'>
				Color submissions
			</Heading>
			{colorSubmissions && <ColorSubmissionsTable colorSubmissions={colorSubmissions} />}
			{colorSubmissions === null && <p>Invalid API key</p>}
			{colorSubmissions === undefined && <p>Fetching color submissions...</p>}
		</Card>
	);
}
