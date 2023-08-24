import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exception-code.enum';

/** Missing admin API token. */
export class MissingTokenException extends BaseHttpException {
	constructor() {
		super('Missing API token', Http.Status.Unauthorized, ExceptionCode.MissingToken);
	}
}
