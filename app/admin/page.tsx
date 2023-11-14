'use client';

import { useState } from 'react';
import ApiKeyInput from '../components/admin/api-key-input';
import H1 from '../components/headings/h1';
import H2 from '../components/headings/h2';
import ColorSubmissionsList from './color-submissions-list';
import VerificationRequestsList from './verification-requests-list';

export default function Admin() {
	const [apiKey, setApiKey] = useState<string | undefined>();

	return (
		<div className='pt-4 flex flex-col gap-y-8'>
			<div className='flex flex-col items-center gap-y-8'>
				<H1>Admin</H1>
				<H2>API key</H2>
				<ApiKeyInput onChange={setApiKey} />

				<div className='flex gap-4'>
					{apiKey && <VerificationRequestsList apiKey={apiKey} />}
					{apiKey && <ColorSubmissionsList apiKey={apiKey} />}
				</div>
			</div>
		</div>
	);
}
