import { ArrowPathIcon, CheckIcon, ExclamationCircleIcon, XMarkIcon } from '@heroicons/react/20/solid';

type Props = {
	status: 'idle' | 'loading' | 'success' | 'error';
	onApprove: () => void;
	onReject: () => void;
};

export function TableRowActions({ onApprove, onReject, status }: Props) {
	if (status === 'idle') {
		return (
			<div className='flex gap-x-1 pt-1 justify-between'>
				<button
					onClick={onApprove}
					className='transition-colors p-2 bg-neutral-700 text-green-400 hover:bg-green-400 hover:text-black rounded w-1/3 flex items-center justify-center'
					type='button'
				>
					<CheckIcon className='h-6' />
				</button>

				<button
					onClick={onReject}
					className='transition-colors p-2 bg-neutral-700 text-red-400 hover:bg-red-400 hover:text-black rounded w-1/3 flex items-center justify-center'
					type='button'
				>
					<XMarkIcon className='h-6' />
				</button>
			</div>
		);
	}

	if (status === 'error') {
		return (
			<div className='flex gap-x-1 pt-1'>
				<div className='bg-red-400 text-neutral-900 rounded w-full flex items-center justify-center p-2 gap-x-2'>
					<ExclamationCircleIcon className='h-6' /> Error
				</div>
			</div>
		);
	}

	if (status === 'success') {
		return (
			<div className='flex gap-x-1 pt-1'>
				<div className='bg-neutral-700 text-green-400 rounded w-full flex items-center justify-center p-2 gap-x-2'>
					<CheckIcon className='h-6' /> Done
				</div>
			</div>
		);
	}

	return (
		<div className='flex gap-x-1 pt-1'>
			<div className='bg-neutral-700 rounded w-full flex items-center justify-center p-2 gap-x-2'>
				<ArrowPathIcon className='h-6 animate-spin' />
			</div>
		</div>
	);
}
