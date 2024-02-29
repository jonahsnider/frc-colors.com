import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import clsx from 'clsx';
import type { Metadata } from 'next';
import PlausibleProvider from 'next-plausible';
import dynamic from 'next/dynamic';
import { Lato } from 'next/font/google';
import { AnalyticsProvider } from './analytics/analytics-provider';
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

const PageView = dynamic(async () => import('./analytics/page-view'), {
	ssr: false,
});

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

			<TrpcProvider>
				<AnalyticsProvider>
					<body className={clsx(lato.className, 'bg-neutral-900 text-white flex flex-col min-h-screen')}>
						<PageView />
						<Navbar />
						<main className='container mx-auto grow px-2'>{children}</main>
						<Footer />
						<VercelAnalytics />
					</body>
				</AnalyticsProvider>
			</TrpcProvider>
		</html>
	);
}
