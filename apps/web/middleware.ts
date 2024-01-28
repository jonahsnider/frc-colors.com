import { type NextRequest, NextResponse } from 'next/server';
import getBaseApiUrl from './shared';

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api')) {
		const targetUrl = request.nextUrl;

		targetUrl.pathname = targetUrl.pathname.slice('/api'.length);
		targetUrl.host = new URL(getBaseApiUrl()).host;

		return NextResponse.redirect(targetUrl, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			status: 301,
		});
	}

	return NextResponse.next();
}
