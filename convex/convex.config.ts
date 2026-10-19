import workpool from '@convex-dev/workpool/convex.config.js';
import { defineApp } from 'convex/server';
import { v } from 'convex/values';

const app = defineApp({
	env: {
		ADMIN_PASSWORD: v.string(),
		FRC_EVENTS_API_KEY: v.string(),
		FRC_EVENTS_USERNAME: v.string(),
		TBA_API_KEY: v.string(),
	},
});
app.use(workpool);
export default app;
