import { name } from '@jonahsnider/util';
import { NextRequest } from 'next/server';
import { ConfigService } from '../config/config.service';
import { AuthService } from './auth.service';
import { IncorrectTokenException } from './exceptions/incorrect-token.exception';
import { MissingTokenException } from './exceptions/missing-token.exception';
import { describe, expect, test } from 'bun:test';

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
