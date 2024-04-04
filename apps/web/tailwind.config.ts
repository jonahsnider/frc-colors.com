import { radixThemePreset } from 'radix-themes-tw';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./components/**/*.{js,ts,jsx,tsx,mdx}',
		'./app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	darkMode: 'class',
	presets: [radixThemePreset],
	plugins: [],
};
// biome-ignore lint/style/noDefaultExport: This must be a default export
export default config;
