import useSwr from 'swr';
import { V1FindManyVerificationRequestsSchema } from '../api/_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import VerificationRequestsTable from '../components/admin/verification-requests/table';
import H2 from '../components/headings/h2';
import { fetcherWithApiKey } from '../swr';

type Props = {
	apiKey: string;
};

export default function VerificationRequestsList({ apiKey }: Props) {
	const { data, error, isLoading } = useSwr<V1FindManyVerificationRequestsSchema>(
		['/api/v1/verification-requests', apiKey],
		{
			fetcher: apiKey ? fetcherWithApiKey : undefined,
		},
	);

	return (
		<div className='flex flex-col items-center gap-y-4'>
			<H2>Verification requests</H2>

			{data && <VerificationRequestsTable requests={data.verificationRequests} />}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
