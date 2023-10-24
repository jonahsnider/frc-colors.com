import { describe, expect, test } from 'bun:test';
import { name } from '@jonahsnider/util';
import { NextRequest } from 'next/server';
import { AuthService } from '../../../../../app/api/_lib/auth/auth.service';
import { IncorrectTokenException } from '../../../../../app/api/_lib/auth/exceptions/incorrect-token.exception';
import { MissingTokenException } from '../../../../../app/api/_lib/auth/exceptions/missing-token.exception';
import { ConfigService } from '../../../../../app/api/_lib/config/config.service';

describe(name(AuthService, AuthService.prototype.assertRequestAuthenticated), () => {
	const authService = new AuthService({ adminApiToken: 'token' } as ConfigService);

	test('throws when token is missing', () => {
		expect(authService.assertRequestAuthenticated(new NextRequest('http://localhost:3000'))).rejects.toBeInstanceOf(
			MissingTokenException,
		);
	});

	test('throws when token is incorrect', () => {
		expect(
			authService.assertRequestAuthenticated(
				new NextRequest('http://localhost:3000', { headers: { authorization: 'Bearer incorrect' } }),
			),
		).rejects.toBeInstanceOf(IncorrectTokenException);
	});

	test('resolves when token is correct', () => {
		expect(
			authService.assertRequestAuthenticated(
				new NextRequest('http://localhost:3000', {
					headers: {
						authorization: 'Bearer token',
					},
				}),
			),
		).resolves.toBeUndefined();
	});
});
