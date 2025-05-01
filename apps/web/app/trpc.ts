import type { AppRouter } from '@frc-colors/api';
import { transformer } from '@frc-colors/api/src/trpc/transformer';
import { httpBatchLink } from '@trpc/client';
import { createTRPCNext } from '@trpc/next';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

if (!NEXT_PUBLIC_API_URL) {
	throw new TypeError('NEXT_PUBLIC_API_URL is not defined');
}

export const trpc = createTRPCNext<AppRouter>({
	transformer,
	config: () => ({
		links: [
			httpBatchLink({
				transformer,
				url: new URL('/trpc', NEXT_PUBLIC_API_URL),
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
