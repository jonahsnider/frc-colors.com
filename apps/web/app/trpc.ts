import type { AppRouter } from '@frc-colors/api';
import { transformer } from '@frc-colors/api/src/trpc/transformer';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';
import getBaseApiUrl from '../shared.js';

export const trpc = createTRPCNext<AppRouter>({
	transformer,
	config: () => ({
		links: [
			httpBatchLink({
				transformer,
				url: new URL('/trpc', getBaseApiUrl()),
				headers: () => {
					const apiKey = globalThis.window?.localStorage.getItem('apiKey');

					if (!apiKey) {
						return {};
					}

					return {
						authorization: `Bearer ${apiKey}`,
					};
				},
			}),
		],
	}),
});

export type RouterInput = inferRouterInputs<AppRouter>;
export type RouterOutput = inferRouterOutputs<AppRouter>;
