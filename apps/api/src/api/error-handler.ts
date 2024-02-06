import { Http } from '@jonahsnider/util';

import { captureException } from '@sentry/bun';
import { ErrorHandler } from 'hono';
import { BaseValidationException } from 'next-api-utils';
import { logger } from '../logger/logger';
import { BaseHttpException } from './exceptions/base.exception';

export const errorHandler: ErrorHandler = (error, context) => {
	if (error instanceof BaseHttpException) {
		context.status(error.statusCode);
		return context.json(error.toResponse());
	}

	if (error instanceof BaseValidationException) {
		context.status(error.statusCode);
		return context.json({
			statusCode: error.statusCode,
			error: error.error,
			code: error.code,
			message: error.message,
		});
	}

	const genericException = new BaseHttpException(
		'An internal error occurred',
		Http.Status.InternalServerError,
		'E_INTERNAL_ERROR',
	);

	captureException(error);
	logger.error(error);

	if (error instanceof Error && error.message.toLowerCase().includes('connect_timeout')) {
		// See https://github.com/porsager/postgres/issues/749
		logger.fatal('DB connection timeout occurred, throwing error to restart the app');
		throw error;
	}

	context.status(genericException.statusCode);
	return context.json(genericException.toResponse());
};
