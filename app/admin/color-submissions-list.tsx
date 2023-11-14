import useSwr from 'swr';
import { V1FindManyColorSubmissionsSchema } from '../api/_lib/teams/color-submissions/dtos/v1/color-submission.dto';
import ColorSubmissionsTable from '../components/admin/color-submissions/table';
import H2 from '../components/headings/h2';
import { fetcherWithApiKey } from '../swr';

type Props = {
	apiKey: string;
};

export default function ColorSubmissionsList({ apiKey }: Props) {
	const { data, error, isLoading } = useSwr<V1FindManyColorSubmissionsSchema>(['/api/v1/color-submissions', apiKey], {
		fetcher: apiKey ? fetcherWithApiKey : undefined,
	});

	return (
		<div className='flex flex-col items-center gap-y-4'>
			<H2>Color submissions</H2>

			{data && <ColorSubmissionsTable colorSubmissions={data.colorSubmissions} apiKey={apiKey} />}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
