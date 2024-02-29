import { usePostHog } from 'posthog-js/react';
import { useEffect } from 'react';
import { trpc } from '../trpc';

export function IdentifyUser() {
	const { data: userIp } = trpc.a.i.useQuery();
	const postHog = usePostHog();

	useEffect(() => {
		if (userIp) {
			postHog.identify(userIp);
		}
	}, [userIp, postHog]);

	return <></>;
}
