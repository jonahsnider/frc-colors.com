import { Schema } from '@frc-colors/api/src/db/index';
import type { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import { CheckIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { formatDistanceToNow } from 'date-fns';

type Props = {
	request: VerificationRequest;
};

export function RequestStatus({ request }: Props) {
	const updatedAt = request.updatedAt ? `Updated ${formatDistanceToNow(new Date(request.updatedAt))} ago` : undefined;

	if (request.status === Schema.VerificationRequestStatus.Finished) {
		return <CheckIcon className='h-6 text-gray-400' title={updatedAt} />;
	}

	if (request.status === Schema.VerificationRequestStatus.Pending) {
		return <ExclamationCircleIcon className='h-6 text-yellow-400' />;
	}

	return <CheckIcon className='h-6 text-red-400' title={updatedAt} />;
}
