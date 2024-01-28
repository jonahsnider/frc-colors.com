'use client';

import { CreateColorSubmission } from '@frc-colors/api/src/color-submissions/dtos/color-submission.dto';
import { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { useState } from 'react';
import { ColorInput } from '../components/color-input';
import { H1 } from '../components/headings/h1';
import { State, SubmitButton } from '../components/submit-button';
import { TeamInput } from '../components/team-input';
import { trpc } from '../trpc';

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

// biome-ignore lint/style/noDefaultExport: This must be a default export
export default function SubmitColors() {
	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [teamNumber, setTeamNumber] = useState<TeamNumber | undefined>(undefined);
	const [primaryColor, setPrimaryColor] = useState<HexColorCode | undefined>(undefined);
	const [secondaryColor, setSecondaryColor] = useState<HexColorCode | undefined>(undefined);

	const parsed = CreateColorSubmission.safeParse({
		teamNumber: teamNumber,
		primaryHex: primaryColor,
		secondaryHex: secondaryColor,
	});
	const isReady = parsed.success;

	const utils = trpc.useUtils();
	const mutation = trpc.colorSubmissions.createForTeam.useMutation({
		onSuccess: () => {
			utils.colorSubmissions.getAll.invalidate();
			utils.colorSubmissions.getAllForTeam.invalidate(teamNumber);
		},
	});

	const state = determineState({
		isLoading: mutation.isPending,
		isError: mutation.isError,
		isSuccess: mutation.isSuccess,
		isReady,
	});

	const onClick = () => {
		if (!isReady) {
			return;
		}

		mutation.mutate(parsed.data);
	};

	return (
		<div className='flex justify-center p-4'>
			<div className='flex flex-col gap-4 items-center w-2/3'>
				<H1>Submit colors for a team</H1>
				<TeamInput
					teamNumber={rawTeam}
					onChange={setRawTeam}
					onValidChange={setTeamNumber}
					className='shadow shadow-neutral-950 bg-neutral-800'
				/>
				<ColorInput
					kind='primary'
					rawColor={rawPrimaryColor}
					onChange={setRawPrimaryColor}
					onValidChange={setPrimaryColor}
					className='shadow shadow-neutral-950 bg-neutral-800'
				/>
				<ColorInput
					kind='secondary'
					rawColor={rawSecondaryColor}
					onChange={setRawSecondaryColor}
					onValidChange={setSecondaryColor}
					className='shadow shadow-neutral-950 bg-neutral-800'
				/>
				<SubmitButton onClick={onClick} state={state}>
					Submit
				</SubmitButton>
			</div>
		</div>
	);
}
