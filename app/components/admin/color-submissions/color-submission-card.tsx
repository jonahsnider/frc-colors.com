'use client';

import { CheckIcon, Cross1Icon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { Button, Card, Code, Link, Text, Tooltip } from '@radix-ui/themes';
import clsx from 'clsx';
import { useMutation } from 'convex/react';
import { formatDistanceToNow, formatRelative } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';
import { useApiKey } from '@/app/hooks/use-api-key';
import { api } from '@/convex/_generated/api';
import type { ColorSubmission } from '@/src/color-submissions/dtos/color-submission.dto';
import type { TeamColors } from '@/src/colors/dtos/colors.dto';
import { Schema } from '@/src/db/index';
import { Toast } from '../../toast';
import { CompareColors } from './compare-colors';

function CardActions({ submission }: { submission: ColorSubmission }) {
	const [password] = useApiKey();
	const updateStatus = useMutation(api.colorSubmissions.updateStatus);
	const [pendingStatus, setPendingStatus] = useState<'FINISHED' | 'REJECTED'>();
	const onUpdate = async (status: 'FINISHED' | 'REJECTED') => {
		if (!password) return;
		setPendingStatus(status);
		try {
			const updated = await updateStatus({ password, id: submission.id, status });
			const action = updated.status === Schema.VerificationRequestStatus.Rejected ? 'rejected' : 'approved';

			toast.custom(() => (
				<Toast icon={<CheckIcon width='22' height='22' />} color='green'>
					Successfully {action} submission <Code>{updated.id}</Code>
				</Toast>
			));
		} catch {
			toast.custom(() => (
				<Toast icon={<ExclamationTriangleIcon width='22' height='22' />} color='red'>
					Failed to update submission {submission.id}
				</Toast>
			));
		} finally {
			setPendingStatus(undefined);
		}
	};

	if (submission.status === Schema.VerificationRequestStatus.Pending) {
		return (
			<div className='flex justify-between items-center w-full pt-rx-2'>
				<Button
					variant='surface'
					color='red'
					size='3'
					onClick={() => onUpdate(Schema.VerificationRequestStatus.Rejected)}
					loading={pendingStatus === Schema.VerificationRequestStatus.Rejected}
					disabled={pendingStatus !== undefined}
				>
					Reject
				</Button>
				<Button
					variant='surface'
					color='jade'
					size='3'
					onClick={() => onUpdate(Schema.VerificationRequestStatus.Finished)}
					loading={pendingStatus === Schema.VerificationRequestStatus.Finished}
					disabled={pendingStatus !== undefined}
				>
					Approve
				</Button>
			</div>
		);
	}

	const result = submission.status === Schema.VerificationRequestStatus.Rejected ? 'Rejected' : 'Approved';
	const icon =
		submission.status === Schema.VerificationRequestStatus.Rejected ? (
			<Cross1Icon width='22' height='22' className='text-gray-12 inline' />
		) : (
			<CheckIcon width='22' height='22' className='text-gray-12 inline' />
		);

	return (
		<div className='pt-1'>
			<div className='bg-neutral-700 rounded flex flex-col gap-y-1 justify-center items-center py-1 text-lg'>
				{submission.updatedAt && (
					<Tooltip content={<Text size='2'>Updated {formatRelative(new Date(submission.updatedAt), new Date())}</Text>}>
						<Text
							size='4'
							className={clsx('w-full rounded-2 text-center p-rx-1', {
								'bg-red-4': submission.status === Schema.VerificationRequestStatus.Rejected,
								'bg-jade-4': submission.status === Schema.VerificationRequestStatus.Finished,
							})}
						>
							{icon} {result} {formatDistanceToNow(new Date(submission.updatedAt))} ago
						</Text>
					</Tooltip>
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

export function ColorSubmissionCard({ submission, oldColors, oldColorsLoading }: Props) {
	return (
		<Card className='flex flex-col gap-y-rx-1'>
			<div className='flex justify-between pb-1 gap-4'>
				<Link
					weight='bold'
					size='4'
					target='_blank'
					rel='noreferrer'
					href={`https://www.google.com/search?q=frc+team+${submission.teamNumber}`}
				>
					{submission.teamNumber}
				</Link>
				<Tooltip content={<Text size='2'>Created {formatRelative(new Date(submission.createdAt), new Date())}</Text>}>
					<Text size='4'>{formatDistanceToNow(new Date(submission.createdAt))} ago</Text>
				</Tooltip>
				<Tooltip content={<Text size='2'>{submission.id}</Text>}>
					<Code size='4'>{submission.id.split('-', 1)[0]}</Code>
				</Tooltip>
			</div>

			<CompareColors loading={oldColorsLoading} colors={oldColors ?? undefined} submission={submission} />

			<CardActions submission={submission} />
		</Card>
	);
}
