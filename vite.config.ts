import { cloudflare } from '@cloudflare/vite-plugin';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
	fmt: {
		singleQuote: true,
		jsxSingleQuote: true,
		useTabs: true,
		printWidth: 120,
		ignorePatterns: ['convex/_generated/**', 'pnpm-lock.yaml', 'src/routeTree.gen.ts'],
	},
	lint: {
		options: {
			typeAware: true,
			typeCheck: true,
		},
		categories: {
			correctness: 'error',
			perf: 'error',
		},
		overrides: [
			{
				files: ['convex/**/*.ts'],
				rules: {
					'no-await-in-loop': 'off',
				},
			},
		],
		ignorePatterns: ['convex/_generated/**', 'src/routeTree.gen.ts'],
		jsPlugins: [
			{
				name: 'vite-plus',
				specifier: 'vite-plus/oxlint-plugin',
			},
		],
		rules: {
			'vite-plus/prefer-vite-plus-imports': 'error',
		},
	},
	preview: { allowedHosts: ['frc-colors.com', 'www.frc-colors.com', 'api.frc-colors.com'] },
	resolve: { tsconfigPaths: true },
	plugins: lazyPlugins(() => [cloudflare({ viteEnvironment: { name: 'ssr' } }), tanstackStart(), react()]),
});
