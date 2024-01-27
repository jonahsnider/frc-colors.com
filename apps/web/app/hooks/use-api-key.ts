'use client';

import { useEffect, useMemo, useState } from 'react';

export function useApiKey(): [string | undefined, (key: string | undefined) => void] {
	const [apiKey, setApiKey] = useState<string | undefined>(undefined);

	useEffect(() => {
		const rawApiKey = globalThis.window?.localStorage.getItem('apiKey') ?? undefined;

		setApiKey(rawApiKey);
	}, []);

	const onChange = useMemo(
		() =>
			(key: string | undefined): void => {
				if (key) {
					globalThis.window?.localStorage.setItem('apiKey', key);
				} else {
					globalThis.window?.localStorage.removeItem('apiKey');
				}
				setApiKey(key);
			},
		[],
	);

	return [apiKey, onChange];
}
