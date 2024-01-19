import { ArrowPathIcon, CheckIcon, ExclamationCircleIcon } from '@heroicons/react/20/solid';
import { captureException } from '@sentry/nextjs';
import { useEffect, useState } from 'react';
import { InternalTeamSchema } from '../api/_lib/internal/team/dtos/internal-team.dto';
import TeamCardButton from '../components/team-card/team-card-button';
import { requestVerification } from './action';

type Props = {
	team: InternalTeamSchema;
};

type State = {
	loading: boolean;
	error: boolean;
	finishedAt: number | undefined;
	team: InternalTeamSchema;
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
	} else if (state.team.colors) {
		if (state.team.colors.verified) {
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

export default function VerificationRequestButton({ team }: Props) {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(false);
	const [finishedAt, setFinishedAt] = useState<number | undefined>(undefined);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is to reset the state when the team changes or when the colors are updated by SWR
	useEffect(() => {
		setLoading(false);
		setError(false);
		setFinishedAt(undefined);
	}, [team]);

	const onClick = async () => {
		setLoading(true);
		setError(false);
		setFinishedAt(undefined);

		try {
			await requestVerification(team.teamNumber);
			// biome-ignore lint/nursery/noUselessLoneBlockStatements: This is not a useless block statement
		} catch (error) {
			setError(true);
			captureException(error);
		} finally {
			// biome-ignore lint/nursery/noUselessLoneBlockStatements: This is not a useless block statement
			setLoading(false);
			setFinishedAt(Date.now());
		}
	};

	const state: State = { loading, error, finishedAt, team };

	const status = getStatus(state);

	return (
		<TeamCardButton onClick={onClick} status={status}>
			<ButtonContents state={state} />
		</TeamCardButton>
	);
}
