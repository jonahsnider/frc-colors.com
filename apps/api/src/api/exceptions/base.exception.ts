import { Http } from '@jonahsnider/util';
import type { Exception } from '../interfaces/exception.interface';

export class BaseHttpException extends Error {
	readonly error: string;
	readonly code: string | undefined;
	readonly statusCode: number;

	constructor(message: string, statusCode: Http.Status, code?: string) {
		super(message);

		this.code = code;
		this.statusCode = statusCode;
		this.error = Http.StatusName[statusCode] ?? BaseHttpException.name;
	}

	toResponse(): Exception {
		return {
			statusCode: this.statusCode,
			error: this.error,
			code: this.code,
			message: this.message,
		};
	}
}
