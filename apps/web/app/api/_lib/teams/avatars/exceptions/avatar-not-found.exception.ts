import { BaseHttpException } from '../../../exceptions/base.exception';
import { ExceptionCode } from '../../../exceptions/enums/exception-code.enum';

export class AvatarNotFoundException extends BaseHttpException {
	constructor() {
		super('Avatar not found', 404, ExceptionCode.AvatarNotFound);
	}
}
