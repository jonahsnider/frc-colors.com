'use client';

import { useState } from 'react';
import useSwr from 'swr';
import { V1FindManyVerificationRequestsSchema } from '../api/_lib/teams/verification-requests/dtos/v1/verification-request.dto';
import ApiKeyInput from '../components/admin/api-key-input';
import VerificationRequestsTable from '../components/admin/verification-requests/table';
import { fetcherWithApiKey } from '../swr';

export default function Admin() {
	const [apiKey, setApiKey] = useState<string | undefined>();

	const { data, error, isLoading } = useSwr<V1FindManyVerificationRequestsSchema>(
		['/api/v1/verification-requests', apiKey],
		{
			fetcher: apiKey ? fetcherWithApiKey : undefined,
		},
	);

	return (
		<div className='flex flex-col items-center gap-y-4 pt-4'>
			<ApiKeyInput onChange={setApiKey} />

			{data && <VerificationRequestsTable requests={data.verificationRequests} />}

			{isLoading && <div>Loading...</div>}

			{error && !isLoading && <div>Error: {error.message}</div>}
		</div>
	);
}
