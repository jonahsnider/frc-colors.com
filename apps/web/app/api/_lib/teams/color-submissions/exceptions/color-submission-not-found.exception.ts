import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../../exceptions/base.exception';
import { ExceptionCode } from '../../../exceptions/enums/exception-code.enum';

export class ColorSubmissionNotFoundException extends BaseHttpException {
	constructor(id: number) {
		super(
			`A color submission with the ID ${id} couldn't be found`,
			Http.Status.NotFound,
			ExceptionCode.ColorSubmissionNotFound,
		);
	}
}
