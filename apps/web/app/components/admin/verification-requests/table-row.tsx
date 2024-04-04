import type { VerificationRequest } from '@frc-colors/api/src/verification-requests/dtos/verification-request.dto';
import { Link, Table, Text, Tooltip } from '@radix-ui/themes';
import { formatDistanceToNow } from 'date-fns';
import NextLink from 'next/link';
import { RequestStatus } from './request-status';

type Props = {
	request: VerificationRequest;
};

export function TableRow({ request }: Props) {
	const updatedAt = request.updatedAt ? `Updated ${formatDistanceToNow(new Date(request.updatedAt))} ago` : undefined;

	return (
		<Table.Row align='center'>
			<Table.RowHeaderCell>
				<Link rel='noreferrer' href={`https://www.google.com/search?q=frc+team+${request.team}`}>
					{request.team}
				</Link>
			</Table.RowHeaderCell>

			<Tooltip content={<Text size='2'>Created {new Date(request.createdAt).toLocaleString()}</Text>}>
				<Table.Cell>{formatDistanceToNow(new Date(request.createdAt))} ago</Table.Cell>
			</Tooltip>

			<Table.Cell align='center'>
				<Tooltip content={<Text size='2'>{updatedAt}</Text>} hidden={!updatedAt}>
					<NextLink href={`/?team=${request.team}`}>
						<RequestStatus request={request} />
					</NextLink>
				</Tooltip>
			</Table.Cell>
		</Table.Row>
	);
}
