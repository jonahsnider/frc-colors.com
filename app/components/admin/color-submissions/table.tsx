import { Callout, ScrollArea } from '@radix-ui/themes';
import { useQuery } from 'convex/react';
import { api } from '@/convex/_generated/api';
import type { ColorSubmission } from '@/src/color-submissions/dtos/color-submission.dto';
import { ColorSubmissionCard } from './color-submission-card';

type Props = {
	colorSubmissions: ColorSubmission[];
};

export function ColorSubmissionsTable({ colorSubmissions }: Props) {
	const oldColors = useQuery(api.colors.getMany, {
		teams: [...new Set(colorSubmissions.map((submission) => submission.teamNumber))],
	});

	if (colorSubmissions.length === 0) {
		return (
			<Callout.Root color='gray' size='1' className='w-full text-nowrap'>
				<Callout.Text>No color submissions</Callout.Text>
			</Callout.Root>
		);
	}

	return (
		<ScrollArea scrollbars='vertical' className='max-h-[48rem]'>
			<div className='flex flex-col gap-y-2 w-full'>
				{colorSubmissions.map((colorSubmission) => (
					<ColorSubmissionCard
						key={colorSubmission._id}
						submission={colorSubmission}
						oldColors={oldColors?.find((entry) => entry.teamNumber === colorSubmission.teamNumber)?.colors ?? undefined}
						oldColorsLoading={oldColors === undefined}
					/>
				))}
				{colorSubmissions.length === 0 && <p className='text-lg lg:text-xl'>No color submissions</p>}
			</div>
		</ScrollArea>
	);
}
