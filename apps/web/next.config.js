const { withPlausibleProxy } = require('next-plausible');
const getBaseApiUrl = require('./shared');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = withPlausibleProxy()({
	productionBrowserSourceMaps: true,
	env: {
		// biome-ignore lint/style/useNamingConvention: This is an environment variable
		NEXT_PUBLIC_API_URL: getBaseApiUrl(),
	},
});

module.exports = nextConfig;
