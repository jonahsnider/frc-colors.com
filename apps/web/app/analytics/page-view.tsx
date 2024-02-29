'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';

// biome-ignore lint/style/noDefaultExport: Has to be a default export for dynamic import
export default function PageView() {
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const posthog = usePostHog();

	// Track pageviews
	useEffect(() => {
		if (pathname && posthog) {
			let url = window.origin + pathname;
			if (searchParams.toString()) {
				url += `?${searchParams.toString()}`;
			}
			posthog.capture('$pageview', {
				// biome-ignore lint/style/useNamingConvention: This can't be renamed
				$current_url: url,
			});
		}
	}, [pathname, searchParams, posthog]);

	return <></>;
}
