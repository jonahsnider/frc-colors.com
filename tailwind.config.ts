import { radixThemePreset } from 'radix-themes-tw';
import type { Config } from 'tailwindcss';

const config: Config = {
	content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './src/routes/**/*.{js,ts,jsx,tsx,mdx}'],
	darkMode: 'class',
	presets: [radixThemePreset],
	plugins: [],
};

export default config;
