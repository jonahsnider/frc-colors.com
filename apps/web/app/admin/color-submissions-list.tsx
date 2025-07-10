import { Schema } from '@frc-colors/api/src/db/index';
import { count } from '@jonahsnider/util';
import { Card, Heading } from '@radix-ui/themes';
import { ColorSubmissionsTable } from '../components/admin/color-submissions/table';
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

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</Card>
	);
}
