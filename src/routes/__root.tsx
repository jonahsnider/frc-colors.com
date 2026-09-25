import { Container, Section, Theme } from '@radix-ui/themes';
import type { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';
import { Footer } from '@/app/components/footer';
import { Navbar } from '@/app/components/navbar/navbar';
import { description, siteName } from '@/app/shared-metadata';
import appCss from '@/app/globals.css?url';

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
	head: () => ({
		meta: [
			{ charSet: 'utf-8' },
			{ name: 'viewport', content: 'width=device-width, initial-scale=1' },
			{ name: 'description', content: description },
			{ name: 'color-scheme', content: 'dark light' },
			{ name: 'theme-color', media: '(prefers-color-scheme: dark)', content: '#101211' },
			{ name: 'theme-color', media: '(prefers-color-scheme: light)', content: '#ffffff' },
			{ title: siteName },
			{ property: 'og:title', content: siteName },
			{ property: 'og:description', content: description },
			{ property: 'og:site_name', content: siteName },
		],
		links: [
			{ rel: 'stylesheet', href: appCss },
			{ rel: 'icon', href: '/favicon.ico', type: 'image/x-icon' },
		],
	}),
	notFoundComponent: () => <div className='p-4 text-center'>Page not found</div>,
	component: RootComponent,
});

function RootComponent() {
	return (
		<html lang='en' suppressHydrationWarning={true}>
			<head>
				<HeadContent />
				{import.meta.env.PROD && (
					<>
						<script async src='/js/script.js' />
						<script
							dangerouslySetInnerHTML={{
								__html: `window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments) }; window.plausible.init = window.plausible.init || function (options) { window.plausible.o = options || {} }; window.plausible.init({ endpoint: '/api/event' });`,
							}}
						/>
					</>
				)}
			</head>
			<body className='min-h-screen'>
				<ThemeProvider attribute='class' enableSystem={true} disableTransitionOnChange={true}>
					<Theme accentColor='jade' grayColor='sage' className='flex flex-col' scaling='110%'>
						<Navbar />
						<Section asChild={true} flexGrow='1' height='100%'>
							<Container asChild={true} p='2'>
								<main>
									<Outlet />
								</main>
							</Container>
						</Section>
						<Footer />
						<Toaster />
					</Theme>
				</ThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
