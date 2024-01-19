import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exception-code.enum';

/** Incorrect admin API token. */
export class IncorrectTokenException extends BaseHttpException {
	constructor() {
		super('Incorrect API token', Http.Status.Forbidden, ExceptionCode.IncorrectToken);
	}
}
