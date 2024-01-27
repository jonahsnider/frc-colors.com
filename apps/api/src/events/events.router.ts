import { z } from 'zod';
import { ManyTeamColors } from '../colors/dtos/colors.dto';
import { publicProcedure, router } from '../trpc/trpc';
import { eventsService } from './events.service';

export const eventsRouter = router({
	colors: router({
		getForTeams: publicProcedure
			.input(z.string())
			.output(ManyTeamColors)
			.query(({ input }) => eventsService.getColorsForEvent(input)),
	}),
});
