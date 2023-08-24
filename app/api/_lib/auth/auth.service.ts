import { NextRequest } from 'next/server';
import { ConfigService, configService } from '../config/config.service';
import { IncorrectTokenException } from './exceptions/incorrect-token.exception';
import { MissingTokenException } from './exceptions/missing-token.exception';

export class AuthService {
	constructor(private readonly config: ConfigService) {}

	public async validateRequest(request: NextRequest): Promise<IncorrectTokenException | undefined> {
		const header = request.headers.get('Authorization');

		if (!header) {
			return new MissingTokenException();
		}

		const token = header.slice('Bearer '.length);

		if (token === this.config.adminApiToken) {
			return undefined;
		}

		return new IncorrectTokenException();
	}
}

export const authService = new AuthService(configService);
