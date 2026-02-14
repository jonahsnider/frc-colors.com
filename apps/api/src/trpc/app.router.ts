import { analyticsRouter } from '../analytics/analytics.router.ts';
import { colorSubmissionsRouter } from '../color-submissions/color-submissions.router.ts';
import { teamsRouter } from '../teams/teams.router.ts';
import { verificationRequestsRouter } from '../verification-requests/verification-requests.router.ts';
import { router } from './trpc.ts';

export const appRouter = router({
	teams: teamsRouter,
	verificationRequests: verificationRequestsRouter,
	colorSubmissions: colorSubmissionsRouter,
	// Short name to avoid adblockers triggering
	a: analyticsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
