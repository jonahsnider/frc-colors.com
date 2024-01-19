'use client';

import { V1FindManyVerificationRequestsSchema } from '@/apps/web/app/api/_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import { fetcherWithApiKey } from '@/apps/web/app/swr';
import useSwr from 'swr';
import { useApiKey } from '../../hooks/use-api-key';
import H2 from '../headings/h2';
import VerificationRequestsTable from './verification-requests/table';

import { V1FindManyColorSubmissionsSchema } from '@/apps/web/app/api/_lib/teams/color-submissions/dtos/v1/color-submission.dto';
import { TeamNumberSchema } from '@/apps/web/app/api/_lib/teams/dtos/team-number.dto';
import H3 from '../headings/h3';
import ColorSubmissionsTable from './color-submissions/table';

type Props = {
	teamNumber: TeamNumberSchema | undefined;
};

export default function AdminTeamSummary({ teamNumber }: Props) {
	const [apiKey] = useApiKey();

	const query = new URLSearchParams();

	if (teamNumber) {
		query.set('team', teamNumber.toString());
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

	if (!(apiKey && teamNumber)) {
		return undefined;
	}

	return (
		<div className='flex flex-col gap-4 pt-8 w-full md:w-auto'>
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
