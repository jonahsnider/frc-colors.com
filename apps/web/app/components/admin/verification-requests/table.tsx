import type { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import { TableRow } from './table-row';

type Props = {
	requests: VerificationRequest[];
};

export function VerificationRequestsTable({ requests }: Props) {
	return (
		<div className='flex flex-col gap-y-1 w-full md:w-auto'>
			{requests.map((verificationRequest) => (
				<TableRow key={verificationRequest.id} request={verificationRequest} />
			))}
			{requests.length === 0 && <p className='text-lg lg:text-xl'>No verification requests</p>}
		</div>
	);
}
