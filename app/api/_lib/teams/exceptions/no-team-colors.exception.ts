import { Http, Sort } from '@jonahsnider/util';
import { BaseHttpException } from '../../exceptions/base.exception';
import { ExceptionCode } from '../../exceptions/enums/exception-code.enum';
import { TeamNumberSchema } from '../../teams/dtos/team-number.dto';

/** Team colors are unavailable. */
export class NoTeamColorsException extends BaseHttpException {
	private static readonly LIST_FORMATTER = new Intl.ListFormat(undefined, { type: 'disjunction' });

	constructor(teamNumber: TeamNumberSchema, years: readonly number[]) {
		const sortedYears = [...years].sort(Sort.descending);
		const yearsChecked = NoTeamColorsException.LIST_FORMATTER.format(sortedYears.map((year) => year.toString()));

		super(
			`Team ${teamNumber} has no colors stored in our database, and no avatar for ${yearsChecked} to extract colors from`,
			Http.Status.NotFound,
			ExceptionCode.TeamNotFound,
		);
	}
}
