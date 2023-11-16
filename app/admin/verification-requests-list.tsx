import useSwr from 'swr';
import { V1FindManyVerificationRequestsSchema } from '../api/_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import VerificationRequestsTable from '../components/admin/verification-requests/table';
import H2 from '../components/headings/h2';
import { useApiKey } from '../hooks/use-api-key';
import { fetcherWithApiKey } from '../swr';
import { count } from '@jonahsnider/util';
import { Schema } from '../api/_lib/db/index';

export default function VerificationRequestsList() {
	const [apiKey] = useApiKey();
	const { data, error, isLoading } = useSwr<V1FindManyVerificationRequestsSchema>(
		['/api/v1/verification-requests', apiKey],
		{
			fetcher: apiKey ? fetcherWithApiKey : undefined,
		},
	);

	const pendingRequests = {
		total: count(
			data?.verificationRequests ?? [],
			(request) => request.status === Schema.VerificationRequestStatus.Pending,
		),
		unique: count(
			new Set(
				(data?.verificationRequests ?? [])
					.filter((request) => request.status === Schema.VerificationRequestStatus.Pending)
					.map((request) => request.team),
			),
		),
	};

	return (
		<div className='flex flex-col items-center gap-y-4'>
			<H2>Verification requests</H2>

			{data && (
				<>
					{Boolean(pendingRequests.total) && (
						<p>
							{pendingRequests.total.toLocaleString()} requests pending ({pendingRequests.unique.toLocaleString()}{' '}
							unique teams)
						</p>
					)}
					<VerificationRequestsTable requests={data.verificationRequests} />
				</>
			)}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
