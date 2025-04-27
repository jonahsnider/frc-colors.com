'use client';

import { Heading, Section } from '@radix-ui/themes';
import { Suspense } from 'react';
import { TeamNumberProvider } from '../contexts/team-number-context';

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<Section id='search' py='4' className='flex flex-col gap-rx-6 items-center grow'>
			<Heading size='8' as='h1' className='[view-transition-name:page-title]'>
				FRC Colors
			</Heading>

			<Suspense>
				<TeamNumberProvider>{children}</TeamNumberProvider>
			</Suspense>
		</Section>
	);
}
