import { TRPCError } from '@trpc/server';
import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { authService } from '../auth/auth.service';

export function createContext(options: CreateHTTPContextOptions): Context {
	if (authService.requestHasToken(options)) {
		if (!authService.requestHasValidToken(options)) {
			throw new TRPCError({
				code: 'FORBIDDEN',
				message: 'Incorrect API token',
			});
		}

		return {
			isAdmin: true,
		};
	}

	return {
		isAdmin: false,
	};
}

export type Context = {
	isAdmin: boolean;
};
