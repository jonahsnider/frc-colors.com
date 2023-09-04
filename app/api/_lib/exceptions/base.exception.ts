import { NextResponse } from 'next/server';
import { STATUS_CODES } from 'node:http';

import { ExceptionCode } from './enums/exception-code.enum';
import { ExceptionSchema } from './dtos/exception.dto';

export class BaseHttpException extends Error {
	readonly error: string;
	readonly code: ExceptionCode | undefined;
	readonly statusCode: number;

	constructor(message: string, statusCode: number, code?: ExceptionCode) {
		super(message);

		this.code = code;
		this.statusCode = statusCode;
		this.error = STATUS_CODES[statusCode] ?? BaseHttpException.name;
	}

	toResponse(): NextResponse<ExceptionSchema> {
		return NextResponse.json(
			{
				statusCode: this.statusCode,
				error: this.error,
				code: this.code,
				message: this.message,
			},
			{ status: this.statusCode },
		);
	}
}
