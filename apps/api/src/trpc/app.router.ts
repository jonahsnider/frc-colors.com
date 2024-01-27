import { colorSubmissionsRouter } from '../color-submissions/color-submissions.router';
import { eventsRouter } from '../events/events.router';
import { teamsRouter } from '../teams/teams.router';
import { verificationRequestsRouter } from '../verification-requests/verification-requests.router';
import { router } from './trpc';

export const appRouter = router({
	events: eventsRouter,
	teams: teamsRouter,
	verificationRequests: verificationRequestsRouter,
	colorSubmissions: colorSubmissionsRouter,
});

// Export type router type signature,
// NOT the router itself.
export type AppRouter = typeof appRouter;
