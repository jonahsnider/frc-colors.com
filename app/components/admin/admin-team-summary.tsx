'use client';

import { InternalTeamSchema } from '@/app/api/_lib/internal/team/dtos/internal-team.dto';
import { V1FindManyVerificationRequestsSchema } from '@/app/api/_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import { fetcherWithApiKey } from '@/app/swr';
import useSwr from 'swr';
import { useApiKey } from '../../hooks/use-api-key';
import H2 from '../headings/h2';
import VerificationRequestsTable from './verification-requests/table';

import { V1FindManyColorSubmissionsSchema } from '@/app/api/_lib/teams/color-submissions/dtos/v1/color-submission.dto';
import H3 from '../headings/h3';
import ColorSubmissionsTable from './color-submissions/table';

type Props = {
	team: InternalTeamSchema | undefined;
};

export default function AdminTeamSummary({ team }: Props) {
	const [apiKey] = useApiKey();

	const query = new URLSearchParams();

	if (team) {
		query.set('team', team.teamNumber.toString());
	}

	const verificationRequests = useSwr<V1FindManyVerificationRequestsSchema>(
		[`/api/v1/verification-requests?${query}`, apiKey],
		{
			fetcher: apiKey ? fetcherWithApiKey : undefined,
		},
	);
	const colorSubmissions = useSwr<V1FindManyColorSubmissionsSchema>([`/api/v1/color-submissions?${query}`, apiKey], {
		fetcher: apiKey ? fetcherWithApiKey : undefined,
	});

	if (!apiKey) {
		return undefined;
	}

	return (
		<div className='flex flex-col gap-4 pt-8'>
			<H2>Admin data</H2>

			<div className='flex flex-col md:flex-row gap-4 md:gap-16'>
				<div className='flex flex-col gap-2'>
					<H3>Verification requests</H3>
					{verificationRequests.data && (
						<VerificationRequestsTable requests={verificationRequests.data.verificationRequests} />
					)}
					{verificationRequests.error && <p>An error occurred while fetching verification requests</p>}
					{verificationRequests.isLoading && <p>Fetching verification requests...</p>}
				</div>

				<div className='flex flex-col gap-2'>
					<H3>Color submissions</H3>
					{colorSubmissions.data && <ColorSubmissionsTable colorSubmissions={colorSubmissions.data.colorSubmissions} />}
					{colorSubmissions.error && <p>An error occurred while fetching color submissions</p>}
					{colorSubmissions.isLoading && <p>Fetching color submissions...</p>}
				</div>
			</div>
		</div>
	);
}
