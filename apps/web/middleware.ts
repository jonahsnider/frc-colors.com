import { type NextRequest, NextResponse } from 'next/server';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
	throw new TypeError('NEXT_PUBLIC_API_URL is not defined');
}

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api')) {
		const targetUrl = request.nextUrl;

		targetUrl.pathname = targetUrl.pathname.slice('/api'.length);
		// biome-ignore lint/style/noNonNullAssertion: This is safe
		targetUrl.host = new URL(NEXT_PUBLIC_API_URL!).host;

		return NextResponse.redirect(targetUrl, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			status: 301,
		});
	}

	return NextResponse.next();
}
