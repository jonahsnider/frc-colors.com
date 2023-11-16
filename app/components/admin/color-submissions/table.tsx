import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import { V1FindManyTeamsSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import { fetcher } from '@/app/swr';
import useSwr from 'swr';
import ColorSubmissionCard from './color-submission-card';

type Props = {
	colorSubmissions: ColorSubmissionSchema[];
};

export default function ColorSubmissionsTable({ colorSubmissions }: Props) {
	const query = new URLSearchParams();

	for (const submission of colorSubmissions) {
		query.append('team', submission.teamNumber.toString());
	}

	const { data: oldColors, isLoading: oldColorsLoading } = useSwr<V1FindManyTeamsSchema>(
		`/api/v1/team?${query.toString()}`,
		{
			fetcher,
		},
	);

	return (
		<div className='flex flex-col gap-y-2 w-full'>
			{colorSubmissions.map((colorSubmission) => (
				<ColorSubmissionCard
					key={colorSubmission.id}
					submission={colorSubmission}
					oldColors={oldColors?.teams[colorSubmission.teamNumber].colors ?? undefined}
					oldColorsLoading={oldColorsLoading}
				/>
			))}
		</div>
	);
}
