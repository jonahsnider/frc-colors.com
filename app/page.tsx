import { Metadata } from 'next';
import H1 from './components/headings/h1';
import SearchTeams from './components/search-teams';
import { description, siteName } from './shared-metadata';

export const metadata: Metadata = {
	title: `Home - ${siteName}`,
	description,
	openGraph: {
		title: 'Home',
		siteName,
		description,
	},
};

export default function HomePage() {
	return (
		<main>
			<section id='search' className='w-full flex flex-col items-center text-center p-4'>
				<H1>FRC Colors</H1>

				<SearchTeams />
			</section>
		</main>
	);
}
