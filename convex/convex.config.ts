import workpool from '@convex-dev/workpool/convex.config.js';
import { defineApp } from 'convex/server';

const app = defineApp();
app.use(workpool);
export default app;
