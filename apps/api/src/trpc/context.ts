import { TRPCError } from '@trpc/server';
import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import type { Server } from 'bun';
import { ApiService } from '../api/api.service';
import { authService } from '../auth/auth.service';

export function createContext(getServer: () => Server, options: FetchCreateContextFnOptions): Context {
	const requestIp = ApiService.getIp(getServer(), options.req);

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
