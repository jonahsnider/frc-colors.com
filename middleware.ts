import { type NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
	if (request.nextUrl.pathname.startsWith('/api') && !request.nextUrl.pathname.startsWith('/api/internal')) {
		return NextResponse.next({
			headers: {
				'Access-Control-Allow-Origin': '*',
			},
		});
	}

	return NextResponse.next();
}
