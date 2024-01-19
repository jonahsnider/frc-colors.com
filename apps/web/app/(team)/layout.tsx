'use client';

import H1 from '../components/headings/h1';
import { TeamNumberProvider } from '../contexts/team-number-context';

export default function TeamLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<section id='search' className='w-full flex flex-col items-center text-center p-4'>
			<H1>FRC Colors</H1>

			<TeamNumberProvider>{children}</TeamNumberProvider>
		</section>
	);
}
