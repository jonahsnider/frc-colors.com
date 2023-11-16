import useSwr from 'swr';
import { V1FindManyColorSubmissionsSchema } from '../api/_lib/teams/color-submissions/dtos/v1/color-submission.dto';
import ColorSubmissionsTable from '../components/admin/color-submissions/table';
import H2 from '../components/headings/h2';
import { useApiKey } from '../hooks/use-api-key';
import { fetcherWithApiKey } from '../swr';
import { Schema } from '../api/_lib/db/index';
import { count } from '@jonahsnider/util';

export default function ColorSubmissionsList() {
	const [apiKey] = useApiKey();
	const { data, error, isLoading } = useSwr<V1FindManyColorSubmissionsSchema>(['/api/v1/color-submissions', apiKey], {
		fetcher: apiKey ? fetcherWithApiKey : undefined,
	});

	const pendingSubmissions = {
		total: count(
			data?.colorSubmissions ?? [],
			(submission) => submission.status === Schema.VerificationRequestStatus.Pending,
		),
		unique: count(
			new Set(
				(data?.colorSubmissions ?? [])
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
						<p>
							{pendingSubmissions.total.toLocaleString()} submissions pending (
							{pendingSubmissions.unique.toLocaleString()} unique teams)
						</p>
					)}
					<ColorSubmissionsTable colorSubmissions={data.colorSubmissions} />
				</>
			)}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
