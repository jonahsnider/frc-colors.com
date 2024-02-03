import { Schema } from '@frc-colors/api/src/db/index';
import { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import clsx from 'clsx';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { RequestStatus } from './request-status';

type Props = {
	request: VerificationRequest;
};

export function TableRow({ request }: Props) {
	return (
		<div
			className={clsx(
				'flex bg-neutral-800 rounded md:gap-x-4 py-1 px-2 justify-between items-center shadow w-full text-lg xl:text-xl xl:px-3 xl:py-1.5',
				{
					'text-gray-400': request.status === Schema.VerificationRequestStatus.Finished,
				},
			)}
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
