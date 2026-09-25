import { cronJobs } from 'convex/server';
import { internal } from './_generated/api';

const crons = cronJobs();

crons.daily('Refresh team colors', { hourUTC: 0, minuteUTC: 0 }, internal.refresh.start, {});

export default crons;
