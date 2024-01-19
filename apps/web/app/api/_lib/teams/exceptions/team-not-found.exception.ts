import { Http } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exception-code.enum';
import { TeamNumberSchema } from '../dtos/team-number.dto';

/** Team number doesn't exist. */
export class TeamNotFoundException extends BaseHttpException {
	constructor(number: TeamNumberSchema) {
		super(`A team with the number ${number} couldn't be found`, Http.Status.NotFound, ExceptionCode.TeamNotFound);
	}
}
