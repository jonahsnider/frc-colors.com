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
	},
};

export default config;
