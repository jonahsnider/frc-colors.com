import { NextResponse } from 'next/server';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { avatarsService } from '../../_lib/teams/avatars/avatars.service';

export const GET = exceptionRouteWrapper.wrapRoute<never>(async () => {
	await avatarsService.purgeExpiredAvatars();

	return new NextResponse();
});
