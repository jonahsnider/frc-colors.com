import { Workpool } from '@convex-dev/workpool';
import { components } from '../_generated/api';

export const refreshPool = new Workpool(components.workpool, {
	maxParallelism: 10,
	retryActionsByDefault: true,
	defaultRetryBehavior: { maxAttempts: 5, initialBackoffMs: 5000, base: 2 },
});
