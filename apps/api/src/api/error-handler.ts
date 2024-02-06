import { Http } from '@jonahsnider/util';

import { captureException } from '@sentry/bun';
import { Context, ErrorHandler } from 'hono';
import { BaseValidationException } from 'next-api-utils';
import { logger } from '../logger/logger';
import { BaseHttpException } from './exceptions/base.exception';

function createResponse(context: Context, error: BaseHttpException): Response {
	context.status(error.statusCode);
	return context.json(error.toResponse());
}

export const errorHandler: ErrorHandler = (error, context) => {
	if (error instanceof BaseHttpException) {
		return createResponse(context, error);
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

	return createResponse(context, genericException);
};
