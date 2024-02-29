import { TRPCError } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import assert from 'assert/strict';
import { Server } from 'bun';
import { authService } from '../auth/auth.service';

export function createContext(getServer: () => Server, options: FetchCreateContextFnOptions): Context {
	const requestIp = getServer().requestIP(options.req)?.address;

	assert(requestIp, new TypeError('IP address was not available on request'));

	if (authService.requestHasToken(options)) {
		if (!authService.requestHasValidToken(options)) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Incorrect API token',
			});
		}

		return {
			isAdmin: true,
			requestIp,
		};
	}

	return {
		isAdmin: false,
		requestIp,
	};
}

export type Context = {
	isAdmin: boolean;
	requestIp: string;
};
