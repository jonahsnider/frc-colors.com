import { Container, Section, Theme } from '@radix-ui/themes';
import { Analytics as VercelAnalytics } from '@vercel/analytics/react';
import type { Metadata, Viewport } from 'next';
import PlausibleProvider from 'next-plausible';
import { ThemeProvider } from 'next-themes';
import { ViewTransitions } from 'next-view-transitions';
import { Suspense } from 'react';
import { Toaster } from 'sonner';
import { AnalyticsProvider } from './analytics/analytics-provider';
import { PageView } from './analytics/page-view-dynamic';
import { Footer } from './components/footer';
import { Navbar } from './components/navbar/navbar';
import { TrpcProvider } from './components/trpc/trpc-provider';
import './globals.css';
import { description, metadataBase, siteName } from './shared-metadata';

export const metadata: Metadata = {
	metadataBase: metadataBase,
	title: { default: siteName, template: `%s - ${siteName}` },
	description,
	openGraph: {
		siteName,
		description,
	},
};

export const viewport: Viewport = {
	themeColor: [
		{
			media: '(prefers-color-scheme: dark)',
			color: '#101211',
		},
		{
			media: '(prefers-color-scheme: light)',
			color: '#ffffff',
		},
	],
	colorScheme: 'dark light',
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<ViewTransitions>
			<html lang='en' suppressHydrationWarning={true}>
				<head>
					<PlausibleProvider enabled={true} selfHosted={true} domain='frc-colors.com' />
				</head>

				<TrpcProvider>
					<AnalyticsProvider>
						<body className='min-h-screen'>
							<ThemeProvider attribute='class' enableSystem={true} disableTransitionOnChange={true}>
								<Theme accentColor='jade' grayColor='sage' className='flex flex-col' scaling='110%'>
									<Suspense>
										<PageView />
									</Suspense>

									<Navbar />
									<Section asChild={true} flexGrow='1' height='100%'>
										<Container asChild={true} p='2'>
											<main>{children}</main>
										</Container>
									</Section>
									<Footer />

									<VercelAnalytics />
									<Toaster />
								</Theme>
							</ThemeProvider>
						</body>
					</AnalyticsProvider>
				</TrpcProvider>
			</html>
		</ViewTransitions>
	);
}
