'use client';

import clsx from 'clsx';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { useContext, useState } from 'react';
import { TeamNumberContext } from '../contexts/team-number-context';
import { useDebouncedCallback } from 'use-debounce';

export default function SearchTeams() {
	const [teamNumberRaw, setTeamNumberRaw] = useState('');
	const setTeamNumber = useDebouncedCallback(useContext(TeamNumberContext).setTeamNumber, 100, { maxWait: 1000 });
	const valid = teamNumberRaw === '' || TeamNumberSchema.safeParse(teamNumberRaw).success;

	return (
		<div className='flex flex-col space-y-4'>
			<input
				className={clsx('transition-all h-14 rounded bg-neutral-200 p-4 outline-none', {
					'border-4 border-red-400': !valid,
				})}
				placeholder='Enter a team number'
				type='text'
				name='team'
				onChange={(event) => {
					setTeamNumberRaw(event.target.value);
					setTeamNumber(event.target.value);
				}}
				// rome-ignore lint/a11y/noAutofocus: <explanation>
				autoFocus
				value={teamNumberRaw}
			/>
		</div>
	);
}
