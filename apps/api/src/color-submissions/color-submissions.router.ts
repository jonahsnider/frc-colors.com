import { TeamNumber } from '../teams/dtos/team-number.dto';
import { adminProcedure, publicProcedure, router } from '../trpc/trpc';
import { colorSubmissionsService } from './color-submissions.service';
import { ColorSubmission, CreateColorSubmission } from './dtos/color-submission.dto';

export const colorSubmissionsRouter = router({
	getAll: adminProcedure
		.output(ColorSubmission.array())
		.query(() => colorSubmissionsService.findManyColorSubmissions()),
	getAllForTeam: adminProcedure
		.input(TeamNumber)
		.output(ColorSubmission.array())
		.query(({ input }) => colorSubmissionsService.findManyColorSubmissions(input)),
	createForTeam: publicProcedure
		.input(CreateColorSubmission)
		.output(ColorSubmission)
		.mutation(({ input }) => colorSubmissionsService.createColorSubmission(input)),
	updateStatus: adminProcedure
		.input(
			ColorSubmission.pick({
				id: true,
				status: true,
			}),
		)
		.output(ColorSubmission)
		.mutation(({ input }) => colorSubmissionsService.modifyColorSubmissionStatus(input.id, input.status)),
});
