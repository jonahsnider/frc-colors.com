import { Schema } from '@frc-colors/api/src/db/index';
import type { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import { CheckIcon, ExclamationTriangleIcon } from '@radix-ui/react-icons';

type Props = {
	request: VerificationRequest;
};

export function RequestStatus({ request }: Props) {
	switch (request.status) {
		case Schema.VerificationRequestStatus.Pending:
			return <ExclamationTriangleIcon width='22' height='22' className='text-amber-10' />;

		case Schema.VerificationRequestStatus.Finished:
			return <CheckIcon width='22' height='22' className='text-gray-9' />;

		case Schema.VerificationRequestStatus.Rejected: {
			return <CheckIcon width='22' height='22' className='text-red-9' />;
		}
	}
}
