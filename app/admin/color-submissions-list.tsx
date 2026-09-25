import { count } from '@jonahsnider/util';
import { Card, Heading } from '@radix-ui/themes';
import { useQuery } from 'convex/react';
import { useState } from 'react';
import { api } from '@/convex/_generated/api';
import { Schema } from '@/src/db/index';
import { ColorSubmissionsTable } from '../components/admin/color-submissions/table';
import { useApiKey } from '../hooks/use-api-key';

export function ColorSubmissionsList() {
	const [password] = useApiKey();
	const [cutoff] = useState(() => Date.now() - 7 * 24 * 60 * 60 * 1000);
	const data = useQuery(api.colorSubmissions.list, password ? { password, cutoff } : 'skip');

	const pendingSubmissions = {
		total: count(data ?? [], (submission) => submission.status === Schema.VerificationRequestStatus.Pending),
		unique: count(
			new Set(
				(data ?? [])
					.filter((submission) => submission.status === Schema.VerificationRequestStatus.Pending)
					.map((submission) => submission.teamNumber),
			),
		),
	};

	return (
		<Card className='flex flex-col items-center gap-y-4'>
			<Heading as='h2' size='6'>
				Color submissions
			</Heading>

			{data && (
				<>
					{Boolean(pendingSubmissions.total) && (
						<p className='text-lg lg:text-xl'>
							{pendingSubmissions.total.toLocaleString()} submissions pending (
							{pendingSubmissions.unique.toLocaleString()} unique teams)
						</p>
					)}
					<ColorSubmissionsTable colorSubmissions={data} />
				</>
			)}

			{data === undefined && <div>Loading...</div>}

			{data === null && <div>Invalid API key</div>}
		</Card>
	);
}
