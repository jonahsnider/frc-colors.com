'use client';

import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';

import { formatDistanceToNow } from 'date-fns';

import { HttpError } from '@/app/swr';

import { Schema } from '@/app/api/_lib/db/index';
import { V1ModifyColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/v1/modify-color-submission.dto';
import { V0ColorsSchema } from '@/app/api/_lib/teams/dtos/v0/team.dto';
import { useApiKey } from '@/app/hooks/use-api-key';
import { useState } from 'react';
import { mutate } from 'swr';
import ColorSubmissionCardActions from './color-submission-card-actions';
import CompareColors from './compare-colors';

type Status = 'idle' | 'loading' | 'success' | 'error';

function CardActions({
	submission,
	setSubmission,
}: { submission: ColorSubmissionSchema; setSubmission: (submission: ColorSubmissionSchema) => void }) {
	const [status, setStatus] = useState<Status>('idle');
	const [apiKey] = useApiKey();

	const update = async (status: Schema.VerificationRequestStatus) => {
		if (!apiKey) {
			return;
		}

		setStatus('loading');
		const body: V1ModifyColorSubmissionSchema = {
			status,
		};
		const response = await fetch(`/api/v1/color-submissions/${submission.id}`, {
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body),
		});

		mutate(['/api/v1/verification-requests', apiKey]);

		if (response.ok) {
			const body = await response.json();
			const newSubmission = ColorSubmissionSchema.parse(body);
			setSubmission(newSubmission);
			setStatus('success');
		} else {
			console.error(await HttpError.create(response));
			setStatus('error');
		}
	};

	if (submission.status === Schema.VerificationRequestStatus.Pending) {
		return (
			<ColorSubmissionCardActions
				status={status}
				onApprove={() => update(Schema.VerificationRequestStatus.Finished)}
				onReject={() => update(Schema.VerificationRequestStatus.Rejected)}
			/>
		);
	}

	const result = submission.status === Schema.VerificationRequestStatus.Rejected ? 'Rejected' : 'Approved';

	return (
		<div className='pt-1'>
			<div className='bg-neutral-700 rounded flex flex-col gap-y-1 justify-center items-center py-1'>
				{submission.updatedAt && (
					<p>
						{result} {formatDistanceToNow(new Date(submission.updatedAt))} ago
					</p>
				)}
				{!submission.updatedAt && <p>{result}</p>}
			</div>
		</div>
	);
}

type Props = {
	submission: ColorSubmissionSchema;
	oldColorsLoading: boolean;
	oldColors: V0ColorsSchema | undefined;
};

export default function ColorSubmissionCard({ submission: originalSubmission, oldColors, oldColorsLoading }: Props) {
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
				<p>{formatDistanceToNow(new Date(submission.createdAt))} ago</p>
				<p>#{submission.id}</p>
			</div>

			<CompareColors loading={oldColorsLoading} colors={oldColors ?? undefined} submission={submission} />

			<CardActions submission={submission} setSubmission={setSubmission} />
		</div>
	);
}
