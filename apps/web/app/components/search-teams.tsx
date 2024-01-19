'use client';

import clsx from 'clsx';
import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { TeamNumberContext } from '../contexts/team-number-context';

type Props = {
	invalidTeam: boolean;
};

export default function SearchTeams({ invalidTeam }: Props) {
	const searchParams = useSearchParams();
	const urlTeam = searchParams.get('team') ?? undefined;
	const router = useRouter();

	const [teamNumberRaw, setTeamNumberRaw] = useState(urlTeam ?? '');
	const setTeamNumber = useDebouncedCallback(useContext(TeamNumberContext).setTeamNumber, 100, { maxWait: 1000 });
	const valid = teamNumberRaw === '' || (TeamNumberSchema.safeParse(teamNumberRaw).success && !invalidTeam);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is only supposed to run once on render
	useEffect(() => {
		if (urlTeam) {
			setTeamNumber(urlTeam);
			setTeamNumberRaw(urlTeam);
		}
	}, []);

	useEffect(() => {
		if (teamNumberRaw === '') {
			router.push('/');
		} else {
			router.push(`/?team=${teamNumberRaw}`);
		}
	}, [teamNumberRaw, router]);

	return (
		<div className='flex flex-col gap-y-4'>
			<input
				className={clsx(
					'transition-all h-14 rounded p-4 outline-none bg-neutral-800 shadow shadow-neutral-950 border-4',
					{
						'border-red-400': !valid,
						'border-transparent': valid,
					},
				)}
				// biome-ignore lint/a11y/noAutofocus: Autofocus is essential to have here
				autoFocus={true}
				placeholder='Enter a team number'
				type='text'
				name='team'
				onChange={(event) => {
					// @ts-expect-error bun-types breaks this
					setTeamNumberRaw(event.target.value);
					// @ts-expect-error bun-types breaks this
					setTeamNumber(event.target.value);
				}}
				value={teamNumberRaw}
			/>
		</div>
	);
}
