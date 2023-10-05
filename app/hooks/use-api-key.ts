'use client';

import { useMemo, useState } from 'react';

// biome-ignore lint/nursery/noConfusingVoidType: This is a return type
export function useApiKey(): [string | undefined, (key: string | undefined) => void] {
	const [apiKey, setApiKey] = useState<string | undefined>(
		// @ts-expect-error bun-types breaks this
		globalThis.window?.localStorage.getItem('apiKey') ?? undefined,
	);

	const onChange = useMemo(
		() => (key: string | undefined): void => {
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
