import { Schema } from '@frc-colors/api/src/db/index';
import { count } from '@jonahsnider/util';
import { Card, Heading } from '@radix-ui/themes';
import { VerificationRequestsTable } from '../components/admin/verification-requests/table';
import { trpc } from '../trpc';

export function VerificationRequestsList() {
	const { data, error, isLoading } = trpc.verificationRequests.getAll.useQuery();

	const pendingRequests = {
		total: count(data ?? [], (request) => request.status === Schema.VerificationRequestStatus.Pending),
		unique: count(
			new Set(
				(data ?? [])
					.filter((request) => request.status === Schema.VerificationRequestStatus.Pending)
					.map((request) => request.team),
			),
		),
	};

	return (
		<Card className='flex flex-col items-center gap-y-4'>
			<Heading as='h2' size='6'>
				Verification requests
			</Heading>

			{data && (
				<>
					{Boolean(pendingRequests.total) && (
						<p className='text-lg lg:text-xl'>
							{pendingRequests.total.toLocaleString()} requests pending ({pendingRequests.unique.toLocaleString()}{' '}
							unique teams)
						</p>
					)}
					<VerificationRequestsTable requests={data} />
				</>
			)}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</Card>
	);
}
