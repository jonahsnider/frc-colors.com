import { type NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
	throw new TypeError('NEXT_PUBLIC_API_URL is not defined');
}

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api')) {
		const targetUrl = request.nextUrl;
		// biome-ignore lint/style/noNonNullAssertion: This is safe
		const apiUrl = new URL(NEXT_PUBLIC_API_URL!);

		targetUrl.pathname = targetUrl.pathname.slice('/api'.length);
		targetUrl.protocol = apiUrl.protocol;
		targetUrl.host = apiUrl.host;
		targetUrl.port = apiUrl.port;

		return NextResponse.redirect(targetUrl, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			status: 301,
		});
	}

	return NextResponse.next();
}
