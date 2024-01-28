import { type NextRequest, NextResponse } from 'next/server';
import getBaseApiUrl from './shared';

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api')) {
		const targetUrl = new URL(request.nextUrl.pathname.slice('/api'.length), getBaseApiUrl());

		return NextResponse.redirect(targetUrl, {
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
			status: 301,
		});
	}

	return NextResponse.next();
}
