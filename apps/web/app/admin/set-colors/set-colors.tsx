'use client';

import { ColorInput } from '@/app/components/color-input';
import { H2 } from '@/app/components/headings/h2';
import { type State, SubmitButton } from '@/app/components/submit-button';
import { TeamCard } from '@/app/components/team-card/team-card';
import { TeamInput } from '@/app/components/team-input';
import { trpc } from '@/app/trpc';
import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { SetColorsInput } from '@frc-colors/api/src/teams/dtos/set-colors-input.dto';
import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { XMarkIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import type { PartialDeep } from 'type-fest';

function determineState({
	isError,
	isLoading,
	isReady,
	succeededAt,
}: { isLoading: boolean; isError: boolean; succeededAt: number | undefined; isReady: boolean }): State {
	if (isLoading) {
		return 'loading';
	}
	if (isError) {
		return 'error';
	}
	if (succeededAt && Date.now() - succeededAt < 3000) {
		return 'success';
	}
	if (isReady) {
		return 'ready';
	}

	return 'invalid';
}

export function SetColors() {
	const [succeededAt, setSucceededAt] = useState<number | undefined>();

	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [team, setTeam] = useState<TeamNumber | undefined>();
	const [primaryColor, setPrimaryColor] = useState<HexColorCode | undefined>();
	const [secondaryColor, setSecondaryColor] = useState<HexColorCode | undefined>();

	const isReady = SetColorsInput.safeParse({
		team: team,
		colors: {
			primary: primaryColor,
			secondary: secondaryColor,
		},
	} satisfies PartialDeep<SetColorsInput>).success;

	const utils = trpc.useUtils();
	const mutation = trpc.teams.colors.set.useMutation({
		onMutate: () => {
			setSucceededAt(undefined);
		},
		onSuccess: () => {
			setSucceededAt(Date.now());
			utils.teams.colors.get.invalidate(team);
			utils.teams.colors.getMany.invalidate([team]);
			utils.verificationRequests.getAll.invalidate();
			utils.verificationRequests.getAllForTeam.invalidate(team);
		},
	});

	const state = determineState({
		isLoading: mutation.isPending,
		isError: mutation.isError,
		succeededAt,
		isReady,
	});

	const reset = () => {
		setRawTeam('');
		setRawPrimaryColor('');
		setRawSecondaryColor('');

		setTeam(undefined);
		setPrimaryColor(undefined);
		setSecondaryColor(undefined);
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
		if (!(isReady && primaryColor && secondaryColor && team)) {
			return;
		}

		mutation.mutate({
			team,
			colors: {
				primary: primaryColor,
				secondary: secondaryColor,
			},
		});
	};

	return (
		<div className='flex flex-col gap-4 items-center w-full md:w-auto'>
			<H2>Set colors</H2>

			<div className='flex flex-col bg-neutral-800 rounded p-2 lg:p-4 gap-2 md:gap-4 w-full'>
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
						disabled={mutation.isPending || !(rawTeam || rawPrimaryColor || rawSecondaryColor)}
						className='transition-colors py-2 px-4 w-1/4 rounded bg-neutral-700 hover:bg-neutral-600 flex items-center justify-center disabled:bg-neutral-600 disabled:text-neutral-400 active:bg-neutral-500'
					>
						<XMarkIcon className='h-8' />
					</button>
				</div>
			</div>

			{team && <TeamCard teamNumber={team} />}
		</div>
	);
}
