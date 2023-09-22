import { Analytics } from '@vercel/analytics/react';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { Lato } from 'next/font/google';
import Footer from './components/footer';
import Navbar from './components/navbar/navbar';
import './globals.css';
import { description, metadataBase, siteName } from './shared-metadata';

const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });

// export const runtime = 'edge';

export const metadata: Metadata = {
	metadataBase: metadataBase,
	title: { default: siteName, template: `%s - ${siteName}` },
	description,
	openGraph: {
		siteName,
		description,
	},
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang='en'>
			<head>
				<PlausibleProvider enabled={true} selfHosted={true} domain='frc-colors.com' />
			</head>

			<body className={lato.className}>
				<Navbar />
				<main className='container mx-auto'>{children}</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
