const { withPlausibleProxy } = require('next-plausible');
const { withSentryConfig } = require('@sentry/nextjs');
const getBaseApiUrl = require('./shared');

/** @type {import('next').NextConfig} */
const nextConfig = withSentryConfig(
	withPlausibleProxy()({
		rewrites: async () => [
			{
				destination: `${getBaseApiUrl()}/:path*`,
				source: '/api/:path*',
			},
		],
		productionBrowserSourceMaps: true,
		sentry: {
			hideSourceMaps: false,
			disableClientWebpackPlugin: true,
		},
	}),
	{
		org: 'frc-colors',
		project: 'frc-colors',
	},
);

module.exports = nextConfig;
