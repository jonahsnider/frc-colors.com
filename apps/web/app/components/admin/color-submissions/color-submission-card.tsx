'use client';

import { formatDistanceToNow, formatRelative } from 'date-fns';

import { trpc } from '@/app/trpc';
import { ColorSubmission } from '@frc-colors/api/src/color-submissions/dtos/color-submission.dto';
import { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { Schema } from '@frc-colors/api/src/db/index';
import { useState } from 'react';
import { TableRowActions as ColorSubmissionCardActions } from './color-submission-card-actions';
import { CompareColors } from './compare-colors';

type Status = 'idle' | 'loading' | 'success' | 'error';

function CardActions({
	submission,
	setSubmission,
}: { submission: ColorSubmission; setSubmission: (submission: ColorSubmission) => void }) {
	const [status, setStatus] = useState<Status>('idle');

	const mutation = trpc.colorSubmissions.updateStatus.useMutation({
		onMutate: () => {
			setStatus('loading');
		},
		onSuccess: (submission) => {
			setSubmission(submission);
			setStatus('success');
		},
		onError: () => {
			setStatus('error');
		},
	});

	if (submission.status === Schema.VerificationRequestStatus.Pending) {
		return (
			<ColorSubmissionCardActions
				status={status}
				onApprove={() => mutation.mutate({ id: submission.id, status: Schema.VerificationRequestStatus.Finished })}
				onReject={() => mutation.mutate({ id: submission.id, status: Schema.VerificationRequestStatus.Rejected })}
			/>
		);
	}

	const result = submission.status === Schema.VerificationRequestStatus.Rejected ? 'Rejected' : 'Approved';

	return (
		<div className='pt-1'>
			<div className='bg-neutral-700 rounded flex flex-col gap-y-1 justify-center items-center py-1'>
				{submission.updatedAt && (
					<p title={`Updated ${formatRelative(new Date(submission.updatedAt), new Date())}`}>
						{result} {formatDistanceToNow(new Date(submission.updatedAt))} ago
					</p>
				)}
				{!submission.updatedAt && <p>{result}</p>}
			</div>
		</div>
	);
}

type Props = {
	submission: ColorSubmission;
	oldColorsLoading: boolean;
	oldColors: TeamColors | undefined;
};

export function ColorSubmissionCard({ submission: originalSubmission, oldColors, oldColorsLoading }: Props) {
	const [submission, setSubmission] = useState(originalSubmission);

	return (
		<div className='flex flex-col gap-y-1 rounded bg-neutral-800 p-2 shadow w-full'>
			<div className='flex justify-between pb-1 gap-x-4'>
				<a
					className='font-bold underline'
					target='_blank'
					rel='noreferrer'
					href={`https://www.google.com/search?q=frc+team+${submission.teamNumber}`}
				>
					{submission.teamNumber}
				</a>
				<p title={`Created ${formatRelative(new Date(submission.createdAt), new Date())}`}>
					{formatDistanceToNow(new Date(submission.createdAt))} ago
				</p>
				<p>#{submission.id}</p>
			</div>

			<CompareColors loading={oldColorsLoading} colors={oldColors ?? undefined} submission={submission} />

			<CardActions submission={submission} setSubmission={setSubmission} />
		</div>
	);
}
