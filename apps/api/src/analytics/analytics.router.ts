import { z } from 'zod';
import { publicProcedure, router } from '../trpc/trpc.ts';

export const analyticsRouter = router({
	// Short name to avoid adblockers triggering
	i: publicProcedure.output(z.string().nullable()).query(({ ctx }) => ctx.requestIp ?? null),
});
