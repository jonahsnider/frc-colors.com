import { trpc } from '@/app/trpc';
import { ColorSubmission } from '@frc-colors/api/src/color-submissions/dtos/color-submission.dto';
import { ColorSubmissionCard } from './color-submission-card';

type Props = {
	colorSubmissions: ColorSubmission[];
};

export function ColorSubmissionsTable({ colorSubmissions }: Props) {
	const oldColors = trpc.teams.colors.getMany.useQuery([581]);

	return (
		<div className='flex flex-col gap-y-2 w-full'>
			{colorSubmissions.map((colorSubmission) => (
				<ColorSubmissionCard
					key={colorSubmission.id}
					submission={colorSubmission}
					oldColors={oldColors.data?.get(colorSubmission.teamNumber)}
					oldColorsLoading={oldColors.isLoading}
				/>
			))}
			{colorSubmissions.length === 0 && <p>No color submissions</p>}
		</div>
	);
}
