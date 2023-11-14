'use client';

import { useState } from 'react';
import { V1CreateColorSubmissionSchema } from '../api/_lib/teams/color-submissions/dtos/v1/create-color-submission.dto';
import { HexColorCodeSchema } from '../api/_lib/teams/colors/saved-colors/dtos/hex-color-code.dto';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import ColorInput from '../components/color-input';
import SubmitButton, { State } from '../components/submit-button';
import TeamInput from '../components/team-input';

export default function SubmitColors() {
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

	let state: State = 'invalid';

	if (isLoading) {
		state = 'loading';
	} else if (isError) {
		state = 'error';
	} else if (isSuccess) {
		state = 'success';
	} else if (isReady) {
		state = 'ready';
	} else {
		state = 'invalid';
	}

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
				<h1 className='text-3xl font-bold'>Submit colors for a team</h1>
				<TeamInput onChange={setTeamNumber} />
				<ColorInput kind='primary' onChange={setPrimaryColor} />
				<ColorInput kind='secondary' onChange={setSecondaryColor} />
				<SubmitButton onClick={onClick} state={state}>
					Submit
				</SubmitButton>
			</div>
		</div>
	);
}
