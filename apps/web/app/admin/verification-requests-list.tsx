import { count } from '@jonahsnider/util';

import { Schema } from '@frc-colors/api/src/db/index';
import { VerificationRequestsTable } from '../components/admin/verification-requests/table';
import { H2 } from '../components/headings/h2';
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
					<VerificationRequestsTable requests={data} />
				</>
			)}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
