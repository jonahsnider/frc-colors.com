import { TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { Context as HonoContext } from 'hono';
import { ApiService } from '../api/api.service.ts';
import { authService } from '../auth/auth.service.ts';

export function createContext(c: HonoContext, options: FetchCreateContextFnOptions): Context {
	const requestIp = ApiService.getIp(c);

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
	requestIp: string | undefined;
};
