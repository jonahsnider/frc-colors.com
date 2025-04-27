'use client';

import { LockClosedIcon } from '@radix-ui/react-icons';
import { Callout, Card, Heading, Section } from '@radix-ui/themes';
import { useState } from 'react';
import { ApiKeyInput } from '../components/admin/api-key-input';
import { ColorSubmissionsList } from './color-submissions-list';
import { SetColors } from './set-colors/set-colors';
import { VerificationRequestsList } from './verification-requests-list';

export default function Admin() {
	const [apiKey, setApiKey] = useState<string | undefined>();

	return (
		<Section className='flex flex-col items-center gap-8 py-4'>
			<Heading as='h1' size='8' className='[view-transition-name:page-title]'>
				Admin
			</Heading>
			<Card className='flex flex-col gap-rx-3 [view-transition-name:small-input]'>
				<Heading as='h2' size='5'>
					API key
				</Heading>
				<ApiKeyInput onChange={setApiKey} />
			</Card>

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
				<Callout.Root color='red'>
					<Callout.Icon>
						<LockClosedIcon width='22' height='22' />
					</Callout.Icon>
					<Callout.Text size='5'>No API key defined</Callout.Text>
				</Callout.Root>
			)}
		</Section>
	);
}
