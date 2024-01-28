import clsx from 'clsx';
import { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	status?: 'idle' | 'loading' | 'success' | 'error';
	onClick?: () => void;
}>;

export function TeamCardButton({ children, onClick, status = 'idle' }: Props) {
	const disabled = status === 'loading' || status === 'success';

	return (
		<button
			type='button'
			onClick={onClick}
			disabled={disabled}
			className={clsx('rounded shadow-neutral-900 transition-all shadow disabled:shadow-none', {
				'bg-green-400 text-black': status === 'success',
				'bg-red-400 text-black': status === 'error',
				'bg-neutral-700 hover:bg-neutral-600 active:bg-neutral-700': status === 'idle',
				'bg-neutral-600': status === 'loading',
			})}
		>
			{children}
		</button>
	);
}
