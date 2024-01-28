'use client';

import { useState } from 'react';
import { ApiKeyInput } from '../components/admin/api-key-input';
import { H1 } from '../components/headings/h1';
import { H2 } from '../components/headings/h2';
import { ColorSubmissionsList } from './color-submissions-list';
import { SetColors } from './set-colors/set-colors';
import { VerificationRequestsList } from './verification-requests-list';

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function Admin() {
	const [apiKey, setApiKey] = useState<string | undefined>();

	return (
		<div className='pt-4 flex flex-col gap-y-8'>
			<div className='flex flex-col items-center gap-y-8'>
				<H1>Admin</H1>
				<H2>API key</H2>
				<ApiKeyInput onChange={setApiKey} />

				{apiKey && (
					<>
						<SetColors />

						<div className='flex flex-col md:flex-row gap-x-4 gap-y-8 md:gap-16 w-full md:min-w-min justify-center'>
							<VerificationRequestsList />
							<ColorSubmissionsList />
						</div>
					</>
				)}
				{!apiKey && (
					<div>
						<p>No API key defined</p>
					</div>
				)}
			</div>
		</div>
	);
}
