'use client';

import { useApiKey } from '@/app/hooks/use-api-key';
import { useEffect } from 'react';

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
		<div>
			<input
				type='password'
				value={apiKey}
				placeholder='API Key'
				className='transition-all h-14 rounded p-4 outline-none bg-neutral-800 shadow shadow-neutral-900'
				onChange={(event) => {
					setApiKey(event.target.value);
				}}
			/>
		</div>
	);
}
