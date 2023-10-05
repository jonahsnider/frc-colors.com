'use client';

import { useApiKey } from '@/app/hooks/use-api-key';
import { useEffect } from 'react';

type Props = {
	// biome-ignore lint/nursery/noConfusingVoidType: This is a return type
	onChange: (apiKey: string | undefined) => void;
};

export default function ApiKeyInput({ onChange }: Props) {
	const [apiKey, setApiKey] = useApiKey();

	// biome-ignore lint/nursery/useExhaustiveDependencies: This should only run once on render
	useEffect(() => {
		onChange?.(apiKey);
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
					// @ts-expect-error bun-types breaks this
					setApiKey(event.target.value);
				}}
			/>
		</div>
	);
}
