'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';

type Props = {
	onChange: (teamNumber: number | undefined) => void;
};

export default function TeamInput({ onChange }: Props) {
	const [teamNumber, setTeamNumber] = useState('');
	const valid = teamNumber === '' || TeamNumberSchema.safeParse(teamNumber).success;

	return (
		<div className='flex flex-col gap-y-4'>
			<input
				className={clsx('transition-all h-14 rounded p-4 outline-none bg-neutral-800 shadow shadow-neutral-950', {
					'border-4 border-red-400': !valid,
				})}
				placeholder='Team number'
				type='text'
				name='team'
				onChange={(event) => {
					// @ts-expect-error bun-types breaks this
					setTeamNumber(event.target.value);

					// @ts-expect-error bun-types breaks this
					const parsed = TeamNumberSchema.safeParse(event.target.value);

					if (parsed.success) {
						onChange(parsed.data);
					} else {
						onChange(undefined);
					}
				}}
				value={teamNumber}
			/>
		</div>
	);
}
