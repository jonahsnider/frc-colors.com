import { NextRequest } from 'next/server';
import { ConfigService, configService } from '../config/config.service';
import { IncorrectTokenException } from './exceptions/incorrect-token.exception';
import { MissingTokenException } from './exceptions/missing-token.exception';

export class AuthService {
	constructor(private readonly config: ConfigService) {}

	public async assertRequestAuthenticated(request: NextRequest): Promise<void> {
		const header = request.headers.get('Authorization');

		if (!header) {
			throw new MissingTokenException();
		}

		const token = header.slice('Bearer '.length);

		if (token !== this.config.adminApiToken) {
			throw new IncorrectTokenException();
		}
	}
}

export const authService = new AuthService(configService);
