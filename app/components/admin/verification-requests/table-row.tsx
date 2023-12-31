import { Schema } from '@/app/api/_lib/db/index';
import { VerificationRequestSchema } from '@/app/api/_lib/teams/verification-requests/dtos/verification-request.dto';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import RequestStatus from './request-status';

type Props = {
	request: VerificationRequestSchema;
};

export default function TableRow({ request }: Props) {
	return (
		<div
			className={clsx('flex bg-neutral-800 rounded md:gap-x-4 py-1 px-2 justify-between shadow w-full', {
				'text-gray-400': request.status === Schema.VerificationRequestStatus.Finished,
			})}
		>
			<a
				className='font-bold underline'
				target='_blank'
				rel='noreferrer'
				href={`https://www.google.com/search?q=frc+team+${request.team}`}
			>
				{request.team}
			</a>

			<p title={`Created ${new Date(request.createdAt).toLocaleString()}`}>
				{formatDistanceToNow(new Date(request.createdAt))} ago
			</p>
			<Link href={`/?team=${request.team}`}>
				<RequestStatus request={request} />
			</Link>
		</div>
	);
}
