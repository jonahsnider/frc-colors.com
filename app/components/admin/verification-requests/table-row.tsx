import { Schema } from '@/app/api/_lib/db/index';
import { VerificationRequestSchema } from '@/app/api/_lib/teams/verification-requests/dtos/verification-request.dto';
import clsx from 'clsx';
import RequestStatus from './request-status';

type Props = {
	request: VerificationRequestSchema;
};

export default function TableRow({ request }: Props) {
	return (
		<div
			className={clsx('flex bg-neutral-800 rounded gap-x-2 py-1 px-2', {
				'text-gray-400': request.status === Schema.VerificationRequestStatus.Finished,
			})}
		>
			<div>{request.team}</div>
			<div>{new Date(request.createdAt).toLocaleString()}</div>
			<div>
				<RequestStatus request={request} />{' '}
			</div>
		</div>
	);
}
