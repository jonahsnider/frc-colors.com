import type { KnipConfig } from 'knip';

const config: KnipConfig = {
	// Loaded by the OpenNext CLI.
	ignore: ['apps/web/open-next.config.ts'],
	workspaces: {
		'apps/api': {
			ignoreDependencies: [
				// Used as a string reference in pino transport config
				'pino-pretty',
			],
		},
	},
};

export default config;
