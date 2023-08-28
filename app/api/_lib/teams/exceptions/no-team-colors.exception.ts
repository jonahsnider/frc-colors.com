import { Http, Sort } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exception-code.enum';
import { TeamNumberSchema } from '../../teams/dtos/team-number.dto';

/** Team colors are unavailable. */
export class NoTeamColorsException extends BaseHttpException {
	constructor(teamNumber: TeamNumberSchema) {
		super(
			`Team ${teamNumber} has no colors stored in our database, and no avatar to extract colors from`,
			Http.Status.NotFound,
			ExceptionCode.TeamNotFound,
		);
	}
}
