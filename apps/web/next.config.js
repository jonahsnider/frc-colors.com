const { withPlausibleProxy } = require('next-plausible');
const getBaseApiUrl = require('./shared');
const dotenv = require('dotenv');
const path = require('node:path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	productionBrowserSourceMaps: true,
	env: {
		// biome-ignore lint/style/useNamingConvention: This is an environment variable
		NEXT_PUBLIC_API_URL: getBaseApiUrl(),
	},
	// biome-ignore lint/suspicious/useAwait: This has to be async for the Next.js API
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
