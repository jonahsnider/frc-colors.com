'use client';

import clsx from 'clsx';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { TeamNumberSchema, TeamNumberStringSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { useDebounce } from 'use-debounce';

export default function SearchTeams({ teamNumber }: { teamNumber?: TeamNumberSchema }) {
	const router = useRouter();
	const [teamNumberRaw, setTeamNumberRaw] = useState<string>(teamNumber?.toString() ?? '');
	const [debouncedTeamNumberRaw] = useDebounce(teamNumberRaw, 250);
	const valid =
		teamNumberRaw === '' ||
		(TeamNumberStringSchema.safeParse(teamNumberRaw).success &&
			TeamNumberSchema.safeParse(TeamNumberStringSchema.parse(teamNumberRaw)).success);

	useEffect(() => {
		const teamNumberString = TeamNumberStringSchema.safeParse(debouncedTeamNumberRaw);

		if (!teamNumberString.success) return;

		const teamNumber = TeamNumberSchema.safeParse(teamNumberString.data);

		if (!teamNumber.success) return;

		router.replace(`/team/${teamNumber.data}`);
	}, [debouncedTeamNumberRaw]);

	return (
		<div className='flex flex-col space-y-4'>
			<input
				className={clsx('transition-all h-14 rounded bg-neutral-200 p-4 outline-none', {
					'border-4 border-red-400': !valid,
				})}
				placeholder='Enter a team number'
				type='text'
				name='team'
				onChange={(event) => setTeamNumberRaw(event.target.value)}
				// rome-ignore lint/a11y/noAutofocus: <explanation>
				autoFocus
				value={teamNumberRaw}
			/>
		</div>
	);
}
