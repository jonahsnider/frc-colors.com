import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import TableRow from './table-row';

type Props = {
	colorSubmissions: ColorSubmissionSchema[];
	apiKey: string;
};

export default function ColorSubmissionsTable({ colorSubmissions, apiKey }: Props) {
	return (
		<div>
			<div className='flex flex-col gap-y-2'>
				{colorSubmissions.map((colorSubmission) => (
					<TableRow key={colorSubmission.id} submission={colorSubmission} apiKey={apiKey} />
				))}
			</div>
		</div>
	);
}
