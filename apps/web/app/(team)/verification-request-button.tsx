import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { CheckIcon, ExclamationTriangleIcon, PlusIcon } from '@radix-ui/react-icons';
import { IconButton, Text, Tooltip } from '@radix-ui/themes';
import clsx from 'clsx';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import { Toast } from '../components/toast';
import { trpc } from '../trpc';

type Props = {
	teamNumber: TeamNumber;
};

export function VerificationRequestButton({ teamNumber }: Props) {
	const utils = trpc.useUtils();

	const colorsQuery = trpc.teams.colors.get.useQuery(teamNumber);

	const mutation = trpc.verificationRequests.createForTeam.useMutation({
		onSuccess: () => {
			utils.verificationRequests.getAll.invalidate();
			utils.verificationRequests.getAllForTeam.invalidate(teamNumber);

			toast.custom(() => {
				let action: string;

				if (colorsQuery.data?.colors) {
					if (colorsQuery.data.colors.verified) {
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
		},
	});

	const onClick = async () => {
		try {
			await mutation.mutateAsync(teamNumber);
		} catch (error) {
			console.error('Error while requesting verification:', error);
		}
	};

	let tooltip: string;
	let icon: ReactNode;

	if (mutation.isSuccess) {
		icon = <CheckIcon width='22' height='22' />;
		tooltip = 'Successfully requested verification';
	} else if (mutation.isError) {
		icon = <ExclamationTriangleIcon width='22' height='22' />;
		tooltip = 'An error occurred - click to try again';
	} else if (colorsQuery.data?.colors) {
		icon = <PlusIcon width='22' height='22' />;
		tooltip = 'Request verification';
	} else {
		icon = <PlusIcon width='22' height='22' />;
		tooltip = 'Request colors';
	}

	const alreadyVerified = colorsQuery.data?.colors?.verified;

	return (
		<Tooltip content={<Text size='2'>{tooltip}</Text>} hidden={alreadyVerified}>
			<IconButton
				size='3'
				color={mutation.isError ? 'red' : undefined}
				type='button'
				onClick={onClick}
				variant='surface'
				className={clsx('transition-opacity', {
					'opacity-0 cursor-default': alreadyVerified,
				})}
				disabled={mutation.isSuccess || mutation.isPending || alreadyVerified}
				loading={mutation.isPending}
			>
				{icon}
			</IconButton>
		</Tooltip>
	);
}
