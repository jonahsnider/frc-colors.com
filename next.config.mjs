import { withPlausibleProxy } from 'next-plausible';

const apiUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.replace('.convex.cloud', '.convex.site');

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({ src: 'https://plausible.io/js/pa-cl6RdTRHDwcw6snO6VH_-.js' })({
	agentRules: false,
	productionBrowserSourceMaps: true,
	allowedDevOrigins: ['frc-colors.com.localhost'],
	async redirects() {
		return [
			{
				source: '/',
				has: [{ type: 'host', value: 'www.frc-colors.com' }],
				destination: 'https://frc-colors.com',
				permanent: true,
			},
			{
				source: '/:path*',
				has: [{ type: 'host', value: 'www.frc-colors.com' }],
				destination: 'https://frc-colors.com/:path*',
				permanent: true,
			},
		];
	},
	async rewrites() {
		return {
			beforeFiles: apiUrl
				? [
						{
							source: '/:path*',
							has: [{ type: 'host', value: 'api.frc-colors.com' }],
							destination: `${apiUrl}/:path*`,
						},
					]
				: [],
			afterFiles: apiUrl
				? [
						{
							source: '/api/v1/:path*',
							destination: `${apiUrl}/v1/:path*`,
						},
						{
							source: '/api/health',
							destination: `${apiUrl}/health`,
						},
						{
							source: '/api/openapi.json',
							destination: `${apiUrl}/openapi.json`,
						},
						{
							source: '/api/internal/:path*',
							destination: `${apiUrl}/internal/:path*`,
						},
					]
				: [],
			fallback: [],
		};
	},
});

export default nextConfig;
