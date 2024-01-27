import { CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { configService } from '../config/config.service';

export class AuthService {
	requestHasToken({ req }: CreateHTTPContextOptions): boolean {
		const header = req.headers.authorization;

		return Boolean(header);
	}

	requestHasValidToken({ req }: CreateHTTPContextOptions): boolean {
		const header = req.headers.authorization;

		if (!header) {
			return false;
		}

		const token = header.slice('Bearer '.length);

		return token === configService.adminApiToken;
	}
}

export const authService = new AuthService();
