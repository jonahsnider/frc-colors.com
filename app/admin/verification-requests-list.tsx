import { count } from '@jonahsnider/util';
import { Card, Heading } from '@radix-ui/themes';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Schema } from '@/src/db/index';
import { VerificationRequestsTable } from '../components/admin/verification-requests/table';
import { useApiKey } from '../hooks/use-api-key';

export function VerificationRequestsList() {
	const [password] = useApiKey();
	const [cutoff] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
	const data = useQuery(api.verificationRequests.list, password ? { password, cutoff } : 'skip');

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

			{data === undefined && <div>Loading...</div>}

			{data === null && <div>Invalid API key</div>}
		</Card>
	);
}
