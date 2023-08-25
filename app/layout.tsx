import type { Metadata } from 'next';
import { Lato } from 'next/font/google';
import './globals.css';
import Navbar from './components/navbar/navbar';
import Footer from './components/footer';
import { description, metadataBase, siteName } from './shared-metadata';
import { Analytics } from '@vercel/analytics/react';
import PlausibleProvider from 'next-plausible';

const lato = Lato({ weight: ['400', '700'], subsets: ['latin'] });

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
				<PlausibleProvider enabled selfHosted domain='frc-colors.com' />
			</head>

			<body className={lato.className}>
				<Navbar />
				<div className='container mx-auto'>{children}</div>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
