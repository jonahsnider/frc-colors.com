const { withPlausibleProxy } = require('next-plausible');
const getBaseApiUrl = require('./shared');

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	productionBrowserSourceMaps: true,
	env: {
		// biome-ignore lint/style/useNamingConvention: This is an environment variable
		NEXT_PUBLIC_API_URL: getBaseApiUrl(),
	},
});

module.exports = nextConfig;
