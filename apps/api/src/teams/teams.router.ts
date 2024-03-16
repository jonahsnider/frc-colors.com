import { z } from 'zod';
import { analyticsService } from '../analytics/analytics.service';
import { colorsService } from '../colors/colors.service';
import { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto';
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
			.query(async ({ input, ctx }) => {
				analyticsService.client.capture({
					distinctId: ctx.requestIp,
					event: 'get_team_colors',
					properties: {
						team: input,
					},
				});
				return { colors: await colorsService.stored.getTeamColors(input) };
			}),
		getMany: publicProcedure
			.input(TeamNumber.array())
			.output(ManyTeamColors)
			.query(({ input, ctx }) => {
				analyticsService.client.capture({
					distinctId: ctx.requestIp,
					event: 'get_many_team_colors',
					properties: {
						teams: input,
					},
				});
				return colorsService.stored.getTeamColors(input);
			}),

		set: adminProcedure.input(SetColorsInput).mutation(async ({ input }) => {
			await colorsService.stored.setTeamColors(input.team, { ...input.colors, verified: true });
			await verificationRequestsService.updatePendingVerificationStatusesByTeam(
				input.team,
				Schema.VerificationRequestStatus.Finished,
			);
		}),
	}),
});
