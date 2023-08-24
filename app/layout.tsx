import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer';

const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'FRC Colors',
	description: "A web app & API to get the primary & secondary/accent colors for an FRC team's logo",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<body className={lato.className}>
				<Navbar />
				<div className='container mx-auto'>{children}</div>
				<Footer />
			</body>
		</html>
	);
}
