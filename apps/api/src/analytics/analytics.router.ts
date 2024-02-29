import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc';

export const analyticsRouter = router({
	// Short name to avoid adblockers triggering
	i: publicProcedure.output(z.string()).query(({ ctx }) => ctx.requestIp),
});
