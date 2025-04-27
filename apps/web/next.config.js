const { withPlausibleProxy } = require('next-plausible');
const getBaseApiUrl = require('./shared');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	productionBrowserSourceMaps: true,
	env: {
		NEXT_PUBLIC_API_URL: getBaseApiUrl(),
	},
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
