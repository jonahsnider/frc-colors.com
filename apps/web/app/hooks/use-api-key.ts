'use client';

import { useEffect, useMemo, useState } from 'react';

export function useApiKey(): [string | undefined, (key: string | undefined) => void] {
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		// @ts-expect-error bun-types breaks this
		const rawApiKey = globalThis.window?.localStorage.getItem('apiKey') ?? undefined;

		setApiKey(rawApiKey);
	}, []);

	const onChange = useMemo(
		() =>
			(key: string | undefined): void => {
				if (key) {
					// @ts-expect-error bun-types breaks this
					globalThis.window?.localStorage.setItem('apiKey', key);
				} else {
					// @ts-expect-error bun-types breaks this
					globalThis.window?.localStorage.removeItem('apiKey');
				}
				setApiKey(key);
			},
		[],
	);

	return [apiKey, onChange];
}
