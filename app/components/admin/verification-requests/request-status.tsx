import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { VerificationRequestStatus } from '@/src/review-status';
import type { VerificationRequest } from '@/src/verification-requests/dtos/verification-request.dto';

type Props = {
	request: VerificationRequest;
};

export function RequestStatus({ request }: Props) {
	switch (request.status) {
		case VerificationRequestStatus.Pending:
			return <ExclamationTriangleIcon width='22' height='22' className='text-amber-10' />;

		case VerificationRequestStatus.Finished:
			return <CheckIcon width='22' height='22' className='text-gray-9' />;

		case VerificationRequestStatus.Rejected: {
			return <CheckIcon width='22' height='22' className='text-red-9' />;
		}
	}
}
