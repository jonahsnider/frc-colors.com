'use client';

import clsx from 'clsx';
import { useContext, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { TeamNumberContext } from '../contexts/team-number-context';

export default function SearchTeams() {
	const [teamNumberRaw, setTeamNumberRaw] = useState('');
	const setTeamNumber = useDebouncedCallback(useContext(TeamNumberContext).setTeamNumber, 100, { maxWait: 1000 });
	const valid = teamNumberRaw === '' || TeamNumberSchema.safeParse(teamNumberRaw).success;

	return (
		<div className='flex flex-col gap-y-4'>
			<input
				className={clsx('transition-all h-14 rounded p-4 outline-none bg-neutral-800 shadow shadow-neutral-900', {
					'border-4 border-red-400': !valid,
				})}
				// biome-ignore lint/a11y/noAutofocus: Autofocus is essential to have here
				autoFocus={true}
				placeholder='Enter a team number'
				type='text'
				name='team'
				onChange={(event) => {
					setTeamNumberRaw(event.target.value);
					setTeamNumber(event.target.value);
				}}
				value={teamNumberRaw}
			/>
		</div>
	);
}
