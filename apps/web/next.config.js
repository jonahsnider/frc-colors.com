const { withPlausibleProxy } = require('next-plausible');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
	throw new TypeError('NEXT_PUBLIC_API_URL is not defined');
}

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({ src: 'https://plausible.io/js/pa-cl6RdTRHDwcw6snO6VH_-.js' })({
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
		return [
			{
				source: '/api/:path*',
				destination: `${apiUrl}/:path*`,
			},
			{
				// Short name to avoid triggering adblockers
				source: '/a/ph/:path*',
				destination: 'https://app.posthog.com/:path*',
			},
		];
	},
});

module.exports = nextConfig;

import('@opennextjs/cloudflare').then((module) => module.initOpenNextCloudflareForDev());
