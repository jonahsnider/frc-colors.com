import { ArrowPathIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import clsx from 'clsx';
import { PropsWithChildren } from 'react';

export type State = 'ready' | 'invalid' | 'loading' | 'success' | 'error';

type Props = PropsWithChildren<{
	onClick: () => void;
	state: State;
}>;

function ButtonContents({ state, children }: PropsWithChildren<{ state: State }>): React.ReactNode {
	switch (state) {
		case 'error':
			return <ExclamationCircleIcon className='h-6' />;
		case 'loading':
			return <ArrowPathIcon className='h-6 animate-spin' />;
		case 'success':
			return <CheckIcon className='h-6' />;
		case 'ready':
		case 'invalid':
			return children;
	}
}

export function SubmitButton({ onClick, children, state }: Props) {
	const disabled = state === 'loading' || state === 'success' || state === 'invalid';

	return (
		<button
			className={clsx('transition-all font-bold py-2 px-4 rounded shadow shadow-neutral-900 disabled:shadow-none', {
				'bg-green-400 hover:bg-green-300 active:bg-green-200 text-black': state === 'ready',
				'bg-green-400 text-black': state === 'success',
				'bg-red-400 hover:bg-red-300 active:bg-red-200 text-black': state === 'error',
				'bg-neutral-600 text-neutral-400': state === 'loading' || state === 'invalid',
			})}
			onClick={onClick}
			disabled={disabled}
			type='button'
		>
			<ButtonContents state={state}>{children}</ButtonContents>
		</button>
	);
}
