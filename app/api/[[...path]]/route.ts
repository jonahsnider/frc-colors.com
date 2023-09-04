import { exceptionRouteWrapper } from '../_lib/exception-route-wrapper';
import { UnknownRouteException } from '../_lib/exceptions/unknown-route.exception';

export const GET = exceptionRouteWrapper.wrapRoute(() => {
	throw new UnknownRouteException();
});
