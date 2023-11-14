import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import { V1TeamSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import useSwr from 'swr';

import { HttpError, fetcher } from '@/app/swr';

import { Schema } from '@/app/api/_lib/db/index';
import { V1ModifyColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/v1/modify-color-submission.dto';
import { useState } from 'react';
import CompareColors from './compare-colors';
import TableRowActions from './table-row-actions';

type Props = {
	submission: ColorSubmissionSchema;
	apiKey: string | undefined;
};

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function TableRow({ submission: originalSubmission, apiKey }: Props) {
	const [submission, setSubmission] = useState(originalSubmission);
	const { data: oldColors, isLoading: oldColorsLoading } = useSwr<V1TeamSchema>(
		`/api/v1/team/${submission.teamNumber}`,
		{
			fetcher,
		},
	);
	const [status, setStatus] = useState<Status>('idle');

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

	return (
		<div className='flex flex-col gap-y-1 rounded bg-neutral-800 p-2'>
			<div className='flex justify-between'>
				<p className='font-bold'>{submission.teamNumber}</p>
				<p>#{submission.id}</p>
			</div>

			<CompareColors loading={oldColorsLoading} team={oldColors} submission={submission} />

			{originalSubmission.status === Schema.VerificationRequestStatus.Pending && (
				<TableRowActions
					status={status}
					onApprove={() => update(Schema.VerificationRequestStatus.Finished)}
					onReject={() => update(Schema.VerificationRequestStatus.Rejected)}
				/>
			)}
			{originalSubmission.status !== Schema.VerificationRequestStatus.Pending && (
				<div className='pt-1'>
					<div className='bg-neutral-700 rounded flex justify-center items-center py-1'>
						{originalSubmission.status === Schema.VerificationRequestStatus.Finished && <p>Approved</p>}
						{originalSubmission.status === Schema.VerificationRequestStatus.Rejected && <p>Rejected</p>}
					</div>
				</div>
			)}
		</div>
	);
}
