const { withPlausibleProxy } = require('next-plausible');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy({ src: 'https://plausible.io/js/pa-cl6RdTRHDwcw6snO6VH_-.js' })({
	productionBrowserSourceMaps: true,
	allowedDevOrigins: ['frc-colors.com.localhost'],
	async rewrites() {
		return [
			{
				// Short name to avoid triggering adblockers
				source: '/a/ph/:path*',
				destination: 'https://app.posthog.com/:path*',
			},
		];
	},
});

module.exports = nextConfig;
