import { Http } from '@jonahsnider/util';
import { captureException } from '@sentry/bun';
import { ErrorHandler } from '@tinyhttp/app';
import { BaseValidationException } from 'next-api-utils';
import { logger } from '../logger/logger';
import { BaseHttpException } from './exceptions/base.exception';

export const errorHandler: ErrorHandler = (error, _req, res, _next) => {
	if (error instanceof BaseHttpException) {
		res.writeHead(error.statusCode).json(error.toResponse());
	} else if (error instanceof BaseValidationException) {
		res.writeHead(error.statusCode).json({
			statusCode: error.statusCode,
			error: error.error,
			code: error.code,
			message: error.message,
		});
	} else if (typeof error === 'object' && 'code' in error && typeof error.code === 'number') {
		const statusMessage = Http.StatusName[error.code] ?? Http.StatusName['Internal Server Error'].toString();

		const exception = new BaseHttpException(statusMessage, error.code);

		res.writeHead(exception.statusCode).json(exception.toResponse());
	} else {
		const genericException = new BaseHttpException(
			'An internal error occurred',
			Http.Status.InternalServerError,
			'E_INTERNAL_ERROR',
		);

		res.writeHead(genericException.statusCode).json(genericException.toResponse());

		captureException(error);

		logger.error(error);

		if (error instanceof Error && error.message.toLowerCase().includes('connect_timeout')) {
			// See https://github.com/porsager/postgres/issues/749
			logger.fatal('DB connection timeout occurred, throwing error to restart the app');
			throw error;
		}
	}
};
