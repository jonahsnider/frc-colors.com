'use client';

import { Heading, Section } from '@radix-ui/themes';
import { Suspense } from 'react';
import { TeamNumberProvider } from '../contexts/team-number-context';

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Section id='search' py='4' className='flex flex-col gap-rx-6 items-center grow'>
			<Heading size='8' as='h1'>
				FRC Colors
			</Heading>

			<Suspense>
				<TeamNumberProvider>{children}</TeamNumberProvider>
			</Suspense>
		</Section>
	);
}
