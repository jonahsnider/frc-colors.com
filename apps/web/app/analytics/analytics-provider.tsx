'use client';

import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';
import type { PropsWithChildren } from 'react';
import { IdentifyUser } from './identify-user';

const postHogKey = process.env.NEXT_PUBLIC_POSTHOG_KEY;

export function AnalyticsProvider({ children }: PropsWithChildren) {
	if (!postHogKey) {
		throw new TypeError('NEXT_PUBLIC_POSTHOG_KEY is not defined');
	}

	if (typeof window !== 'undefined') {
		posthog.init(postHogKey, {
			api_host: '/a/ph',

			capture_pageview: false, // Disable automatic pageview capture, as we capture manually
		});
	}

	return (
		<PostHogProvider client={posthog}>
			{children}
			<IdentifyUser />
		</PostHogProvider>
	);
}
