import { Http } from '@jonahsnider/util';

import { BaseHttpException } from './base.exception';
import { ExceptionCode } from './enums/exception-code.enum';

export class UnknownRouteException extends BaseHttpException {
	constructor() {
		super('Unknown route', Http.Status.NotFound, ExceptionCode.UnknownRoute);
	}
}
