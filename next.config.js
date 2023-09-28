const { withPlausibleProxy } = require('next-plausible');
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = withSentryConfig(
	withPlausibleProxy()({
		productionBrowserSourceMaps: true,
		sentry: {
			hideSourceMaps: true,
			disableClientWebpackPlugin: true,
		},
		experimental: {
			serverActions: true,
		},
	}),
	{
		org: 'frc-colors',
		project: 'frc-colors',
	},
);

module.exports = nextConfig;
