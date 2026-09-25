import { createStartHandler, defaultStreamHandler } from '@tanstack/react-start/server';

const startHandler = createStartHandler(defaultStreamHandler);
const plausibleScriptUrl = 'https://plausible.io/js/pa-cl6RdTRHDwcw6snO6VH_-.js';

async function forward(request: Request, destination: URL) {
	return fetch(new Request(destination, request));
}

export default {
	async fetch(request: Request) {
		const url = new URL(request.url);

		if (url.hostname === 'www.frc-colors.com') {
			url.hostname = 'frc-colors.com';
			url.protocol = 'https:';
			return Response.redirect(url, 308);
		}

		if (url.hostname === 'api.frc-colors.com') {
			return forward(request, new URL(url.pathname + url.search, import.meta.env.VITE_CONVEX_SITE_URL));
		}

		if (url.pathname === '/js/script.js') {
			return forward(request, new URL(plausibleScriptUrl));
		}
		if (url.pathname === '/api/event') {
			return forward(request, new URL('https://plausible.io/api/event'));
		}

		return startHandler(request);
	},
};
