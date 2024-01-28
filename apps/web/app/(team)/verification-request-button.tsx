import type { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { ArrowPathIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { TeamCardButton } from '../components/team-card/team-card-button';
import { trpc } from '../trpc';

type Props = {
	teamNumber: TeamNumber;
};

type State = {
	loading: boolean;
	error: boolean;
	finishedAt: number | undefined;
	colors: TeamColors | undefined;
};

function getStatus(state: State): 'loading' | 'error' | 'success' | 'idle' {
	if (state.error) {
		return 'error';
	}
	if (state.loading) {
		return 'loading';
	}
	if (state.finishedAt) {
		return 'success';
	}
	return 'idle';
}

function ButtonContents({ state }: { state: State }): React.ReactNode {
	let inner: React.ReactNode;
	let alt: string | undefined;

	if (state.error) {
		inner = <ExclamationCircleIcon className='h-6' />;
	} else if (state.loading) {
		inner = <ArrowPathIcon className='h-6 animate-spin' />;
	} else if (state.finishedAt) {
		inner = <CheckIcon className='h-6' />;
	} else if (state.colors) {
		if (state.colors.verified) {
			inner = <ExclamationCircleIcon className='h-6' />;
			alt = 'Report incorrect colors';
		} else {
			inner = 'Request verification';
		}
	} else {
		inner = 'Request colors';
	}

	return (
		<div className='px-2 py-1' title={alt}>
			{inner}
		</div>
	);
}

export function VerificationRequestButton({ teamNumber }: Props) {
	const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);
	const mutation = trpc.verificationRequests.createForTeam.useMutation({
		onMutate: () => {
			setFinishedAt(undefined);
		},
		onSettled: () => {
			setFinishedAt(Date.now());
		},
	});
	const colorsQuery = trpc.teams.colors.get.useQuery(teamNumber);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is to reset the state when the team changes or when the colors are updated by SWR
	useEffect(() => {
		setFinishedAt(undefined);
	}, [teamNumber]);

	const onClick = async () => {
		setFinishedAt(undefined);

		try {
			await mutation.mutateAsync(teamNumber);
		} catch (error) {
			console.error('Error while requesting verification:', error);
		}
	};

	const state: State = {
		loading: mutation.isPending,
		error: mutation.isError,
		finishedAt,
		colors: colorsQuery.data?.colors,
	};

	const status = getStatus(state);

	return (
		<TeamCardButton onClick={onClick} status={status}>
			<ButtonContents state={state} />
		</TeamCardButton>
	);
}
