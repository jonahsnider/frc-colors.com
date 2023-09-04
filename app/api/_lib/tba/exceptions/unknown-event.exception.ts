import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';

export class UnknownEventException extends BaseHttpException {
	constructor(eventCode: string) {
		super(`Event ${eventCode} not found on TBA.`, Http.Status.NotFound);
	}
}
