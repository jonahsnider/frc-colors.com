import { VerificationRequestSchema } from '@/apps/web/app/api/_lib/teams/verification-requests/dtos/verification-request.dto';
import TableRow from './table-row';

type Props = {
	requests: VerificationRequestSchema[];
};

export default function VerificationRequestsTable({ requests }: Props) {
	return (
		<div className='flex flex-col gap-y-1 w-full md:w-auto'>
			{requests.map((verificationRequest) => (
				<TableRow key={verificationRequest.id} request={verificationRequest} />
			))}
			{requests.length === 0 && <p>No verification requests</p>}
		</div>
	);
}
