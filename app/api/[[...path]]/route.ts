import { NextResponse } from 'next/server';
import { ExceptionSchema } from '../_lib/exceptions/dtos/exception.dto';
import { UnknownRouteException } from '../_lib/exceptions/unknown-route.exception';

export function GET(): NextResponse<ExceptionSchema> {
	return new UnknownRouteException().toResponse();
}
