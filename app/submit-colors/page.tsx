'use client';

import { useState } from 'react';
import { V1CreateColorSubmissionSchema } from '../api/_lib/teams/color-submissions/dtos/v1/create-color-submission.dto';
import { HexColorCodeSchema } from '../api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import ColorInput from '../components/color-input';
import H1 from '../components/headings/h1';
import SubmitButton, { State } from '../components/submit-button';
import TeamInput from '../components/team-input';

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

export default function SubmitColors() {
	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [teamNumber, setTeamNumber] = useState<TeamNumberSchema | undefined>(undefined);
	const [primaryColor, setPrimaryColor] = useState<HexColorCodeSchema | undefined>(undefined);
	const [secondaryColor, setSecondaryColor] = useState<HexColorCodeSchema | undefined>(undefined);

	const [isLoading, setIsLoading] = useState(false);
	const [isError, setIsError] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);

	const body = V1CreateColorSubmissionSchema.safeParse({
		teamNumber: teamNumber,
		primaryHex: primaryColor,
		secondaryHex: secondaryColor,
	});

	const isReady = body.success;

	const state = determineState({ isLoading, isError, isSuccess, isReady });

	const onClick = () => {
		if (!isReady) {
			return;
		}

		setIsLoading(true);
		setIsError(false);
		setIsSuccess(false);

		fetch('/api/v1/color-submissions', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify(body.data),
		})
			.then((res) => {
				if (!res.ok) {
					throw new Error('Failed to submit colors');
				}
			})
			.then(() => {
				setIsSuccess(true);
			})
			.catch(() => {
				setIsError(true);
			})
			.finally(() => {
				setIsLoading(false);
			});
	};

	return (
		<div className='flex justify-center p-4'>
			<div className='flex flex-col gap-4 items-center'>
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
