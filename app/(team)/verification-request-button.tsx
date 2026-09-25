import { CheckIcon, ExclamationTriangleIcon, PlusIcon } from '@radix-ui/react-icons';
import { IconButton, Text, Tooltip } from '@radix-ui/themes';
import clsx from 'clsx';
import { useMutation, useQuery } from 'convex/react';
import { type ReactNode, useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';
import { Toast } from '../components/toast';

type Props = {
	teamNumber: TeamNumber;
};

export function VerificationRequestButton({ teamNumber }: Props) {
	const colors = useQuery(api.colors.getOne, { team: teamNumber });
	const createRequest = useMutation(api.verificationRequests.create);
	const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

	const onClick = async () => {
		setStatus('pending');
		try {
			await createRequest({ team: teamNumber });
			setStatus('success');
			toast.custom(() => {
				let action: string;

				if (colors) {
					if (colors.verified) {
						action = 'reverification';
					} else {
						action = 'verification';
					}
				} else {
					action = 'colors';
				}

				return (
					<Toast icon={<CheckIcon width='22' height='22' />} color='green'>
						Successfully requested {action} for team {teamNumber}
					</Toast>
				);
			});
		} catch (error) {
			setStatus('error');
			console.error('Error while requesting verification:', error);
		}
	};

	let tooltip: string;
	let icon: ReactNode;

	if (status === 'success') {
		icon = <CheckIcon width='22' height='22' />;
		tooltip = 'Successfully requested verification';
	} else if (status === 'error') {
		icon = <ExclamationTriangleIcon width='22' height='22' />;
		tooltip = 'An error occurred - click to try again';
	} else if (colors) {
		icon = <PlusIcon width='22' height='22' />;
		tooltip = 'Request verification';
	} else {
		icon = <PlusIcon width='22' height='22' />;
		tooltip = 'Request colors';
	}

	const alreadyVerified = colors?.verified;

	return (
		<Tooltip content={<Text size='2'>{tooltip}</Text>} hidden={alreadyVerified}>
			<IconButton
				size='3'
				color={status === 'error' ? 'red' : undefined}
				type='button'
				onClick={onClick}
				variant='surface'
				className={clsx('transition-opacity', {
					'opacity-0 cursor-default': alreadyVerified,
				})}
				disabled={status === 'success' || status === 'pending' || alreadyVerified}
				loading={status === 'pending'}
			>
				{icon}
			</IconButton>
		</Tooltip>
	);
}
