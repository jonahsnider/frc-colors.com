import { z } from 'zod';
import { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto';
import { storedColors } from '../colors/stored/stored-colors.service';
import { Schema } from '../db/index';
import { tbaService } from '../tba/tba.service';
import { adminProcedure, publicProcedure, router } from '../trpc/trpc';
import { verificationRequestsService } from '../verification-requests/verification-requests.service';
import { SetColorsInput } from './dtos/set-colors-input.dto';
import { TeamNumber } from './dtos/team-number.dto';

export const teamsRouter = router({
	getName: publicProcedure
		.input(TeamNumber)
		.output(
			z.object({
				name: z.string().optional(),
			}),
		)
		.query(async ({ input }) => ({ name: await tbaService.getTeamName(input) })),

	colors: router({
		get: publicProcedure
			.input(TeamNumber)
			.output(z.object({ colors: TeamColors.optional() }))
			.query(async ({ input }) => ({ colors: await storedColors.getTeamColors(input) })),
		getMany: publicProcedure
			.input(TeamNumber.array())
			.output(ManyTeamColors)
			.query(({ input }) => storedColors.getTeamColors(input)),

		set: adminProcedure.input(SetColorsInput).mutation(async ({ input }) => {
			await storedColors.setTeamColors(input.team, { ...input.colors, verified: true });
			await verificationRequestsService.updatePendingVerificationStatusesByTeam(
				input.team,
				Schema.VerificationRequestStatus.Finished,
			);
		}),
	}),
});
