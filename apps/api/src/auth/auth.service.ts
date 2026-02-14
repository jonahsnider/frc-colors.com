import type { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';
import { configService } from '../config/config.service.ts';

class AuthService {
	requestHasToken({ req }: FetchCreateContextFnOptions): boolean {
		const header = req.headers.get('authorization');

		return Boolean(header);
	}

	requestHasValidToken({ req }: FetchCreateContextFnOptions): boolean {
		const header = req.headers.get('authorization');

		if (!header) {
			return false;
		}

		const token = header.slice('Bearer '.length);

		return token === configService.adminApiToken;
	}
}

export const authService = new AuthService();
