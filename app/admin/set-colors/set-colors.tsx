'use client';

import { HexColorCodeSchema } from '@/app/api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';
import { SaveTeamSchema } from '@/app/api/_lib/teams/dtos/save-team.dto';
import { TeamNumberSchema } from '@/app/api/_lib/teams/dtos/team-number.dto';
import ColorInput from '@/app/components/color-input';
import H2 from '@/app/components/headings/h2';
import SubmitButton, { State } from '@/app/components/submit-button';
import TeamCard from '@/app/components/team-card/team-card';
import TeamInput from '@/app/components/team-input';
import { getTeamAvatarUrl } from '@/app/components/util/team-avatar-url';
import { useApiKey } from '@/app/hooks/use-api-key';
import { useTeam } from '@/app/hooks/use-team';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';

function determineState({
	isError,
	isLoading,
	isReady,
	isSuccess,
}: { isLoading: boolean; isError: boolean; isSuccess: boolean; isReady: boolean }): State {
	if (isLoading) {
		return 'loading';
	}
	if (isError) {
		return 'error';
	}
	if (isSuccess) {
		return 'success';
	}
	if (isReady) {
		return 'ready';
	}

	return 'invalid';
}

export default function SetColors() {
	const [apiKey] = useApiKey();

	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [team, setTeam] = useState<TeamNumberSchema | undefined>();
	const [primaryColor, setPrimaryColor] = useState<HexColorCodeSchema | undefined>();
	const [secondaryColor, setSecondaryColor] = useState<HexColorCodeSchema | undefined>();

	const actualTeamData = useTeam(team);

	const body = SaveTeamSchema.safeParse({
		primary: primaryColor,
		secondary: secondaryColor,
	} satisfies Partial<SaveTeamSchema>);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [succeededAt, setSucceededAt] = useState<number | undefined>();
	const isReady = body.success;

	const state = determineState({ isLoading, isError, isSuccess: Boolean(succeededAt), isReady });

	const reset = () => {
		setRawTeam('');
		setRawPrimaryColor('');
		setRawSecondaryColor('');

		setTeam(undefined);
		setPrimaryColor(undefined);
		setSecondaryColor(undefined);

		setIsError(false);
		setSucceededAt(undefined);
		setIsLoading(false);
	};

	useEffect(() => {
		if (succeededAt) {
			const timeout = setTimeout(() => {
				setSucceededAt(undefined);
			}, 3000);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [succeededAt]);

	const onSubmit = () => {
		if (!(isReady && apiKey && team)) {
			return;
		}

		setIsLoading(true);
		setIsError(false);
		setSucceededAt(undefined);

		fetch(`/api/v1/team/${team}`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				authorization: `Bearer ${apiKey}`,
			},
			body: JSON.stringify(body.data),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Failed to submit colors');
				}
			})
			.then(() => {
				setSucceededAt(Date.now());
			})
			.catch(() => {
				setIsError(true);
			})
			.finally(() => {
				actualTeamData.mutate?.();
				mutate(['/api/v1/verification-requests', apiKey]);
				mutate([`/api/v1/verification-requests?team=${team}`, apiKey]);
				mutate(`/api/internal/team/${team}`);
				setIsLoading(false);
			});
	};

	return (
		<div className='flex flex-col gap-4 items-center w-full md:w-auto'>
			<H2>Set colors</H2>

			<div className='flex flex-col bg-neutral-800 rounded p-2 gap-2 md:gap-4 w-full'>
				<TeamInput teamNumber={rawTeam} onChange={setRawTeam} onValidChange={setTeam} className='bg-neutral-700' />

				<div className='flex gap-2 flex-col md:flex-row'>
					<ColorInput
						kind='primary'
						rawColor={rawPrimaryColor}
						onChange={setRawPrimaryColor}
						onValidChange={setPrimaryColor}
						className='bg-neutral-700'
					/>
					<ColorInput
						kind='secondary'
						rawColor={rawSecondaryColor}
						onChange={setRawSecondaryColor}
						onValidChange={setSecondaryColor}
						className='bg-neutral-700'
					/>
				</div>

				<div className='flex gap-2 justify-between'>
					<SubmitButton onClick={onSubmit} state={state}>
						Set colors
					</SubmitButton>

					<button
						type='reset'
						onClick={reset}
						disabled={isLoading || !(rawTeam || rawPrimaryColor || rawSecondaryColor)}
						className='transition-colors py-2 px-4 w-1/4 rounded bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center disabled:bg-neutral-600 disabled:text-neutral-400 active:bg-neutral-500'
					>
						<XMarkIcon className='h-6' />
					</button>
				</div>
			</div>

			{team && (
				<TeamCard
					teamNumber={team}
					avatarUrl={getTeamAvatarUrl(team)}
					colors={actualTeamData.team?.colors ?? undefined}
					teamName={actualTeamData.team?.teamName ?? undefined}
					isLoading={actualTeamData.isLoading}
				/>
			)}
		</div>
	);
}
