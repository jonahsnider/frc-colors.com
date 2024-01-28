import { Analytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import { Lato } from 'next/font/google';
import { Footer } from './components/footer';
import { Navbar } from './components/navbar/navbar';
import { TrpcProvider } from './components/trpc/trpc-provider';
import './globals.css';
import { description, metadataBase, siteName } from './shared-metadata';

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

// biome-ignore lint/style/noDefaultExport: This must be a default export
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

			<body className={clsx(lato.className, 'bg-neutral-900 text-white flex flex-col min-h-screen')}>
				<Navbar />
				<main className='container mx-auto grow px-2'>
					<TrpcProvider>{children}</TrpcProvider>
				</main>
				<Footer />
				<Analytics />
			</body>
		</html>
	);
}
