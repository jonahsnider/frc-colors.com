import { count } from '@jonahsnider/util';

import { Schema } from '@frc-colors/api/src/db/index';
import { ColorSubmissionsTable } from '../components/admin/color-submissions/table';
import { H2 } from '../components/headings/h2';
import { trpc } from '../trpc';

export function ColorSubmissionsList() {
	const { data, error, isLoading } = trpc.colorSubmissions.getAll.useQuery();

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
		<div className='flex flex-col items-center gap-y-4'>
			<H2>Color submissions</H2>

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

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
