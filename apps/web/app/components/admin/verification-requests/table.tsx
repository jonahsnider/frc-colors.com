import type { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import { Callout, ScrollArea, Table } from '@radix-ui/themes';
import { TableRow } from './table-row';

type Props = {
	requests: VerificationRequest[];
};

export function VerificationRequestsTable({ requests }: Props) {
	if (requests.length === 0) {
		return (
			<Callout.Root color='gray' size='1' className='w-full text-nowrap'>
				<Callout.Text>No verification requests</Callout.Text>
			</Callout.Root>
		);
	}

	return (
		<ScrollArea scrollbars='vertical' className='rounded-3 max-h-[48rem]'>
			<Table.Root size='3' variant='ghost'>
				<Table.Header>
					<Table.Row>
						<Table.ColumnHeaderCell>Team</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Created at</Table.ColumnHeaderCell>
						<Table.ColumnHeaderCell>Status</Table.ColumnHeaderCell>
					</Table.Row>
				</Table.Header>

				<Table.Body>
					{requests.map((verificationRequest) => (
						<TableRow key={verificationRequest.id} request={verificationRequest} />
					))}
				</Table.Body>
			</Table.Root>
		</ScrollArea>
	);
}
