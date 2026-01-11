import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	workspaces: {
		'.': {
			ignoreDependencies: [
				// Used in CI workflow
				'vercel',
			],
		},
		'apps/api': {
			ignoreDependencies: [
				// Used as a string reference in pino transport config
				'pino-pretty',
			],
		},
		'apps/web': {
			ignoreDependencies: [
				// Internal monorepo dependency
				'@frc-colors/api',
			],
		},
	},
};

export default config;
