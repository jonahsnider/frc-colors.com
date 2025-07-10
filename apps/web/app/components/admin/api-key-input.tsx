'use client';

import { TextField } from '@radix-ui/themes';
import { useEffect } from 'react';
import { useApiKey } from '@/app/hooks/use-api-key';

type Props = {
	onChange: (apiKey: string | undefined) => void;
};

export function ApiKeyInput({ onChange }: Props) {
	const [apiKey, setApiKey] = useApiKey();

	// biome-ignore lint/correctness/useExhaustiveDependencies: This should only run once on render
	useEffect(() => {
		onChange(apiKey);
	}, []);

	useEffect(() => {
		onChange(apiKey);
	}, [apiKey, onChange]);

	return (
		<TextField.Root
			size='3'
			type='password'
			value={apiKey ?? ''}
			placeholder='API Key'
			onChange={(event) => {
				setApiKey(event.target.value);
			}}
		/>
	);
}
