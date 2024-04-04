'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { useDebouncedCallback } from 'use-debounce';

import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { TextField } from '@radix-ui/themes';
import { TeamNumberContext } from '../contexts/team-number-context';

type Props = {
	invalidTeam: boolean;
};

export function SearchTeams({ invalidTeam }: Props) {
	const searchParams = useSearchParams();
	const urlTeam = searchParams.get('team') ?? undefined;
	const router = useRouter();

	const [teamNumberRaw, setTeamNumberRaw] = useState(urlTeam ?? '');
	const setTeamNumber = useDebouncedCallback(useContext(TeamNumberContext).setTeamNumber, 100, { maxWait: 1000 });
	const valid = teamNumberRaw === '' || (TeamNumber.safeParse(teamNumberRaw).success && !invalidTeam);

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
		<TextField.Root
			size='3'
			autoFocus={true}
			type='text'
			placeholder='Enter a team number'
			onChange={(event) => {
				setTeamNumberRaw(event.target.value);
				setTeamNumber(event.target.value);
			}}
			value={teamNumberRaw}
			color={valid ? undefined : 'red'}
		/>
	);
}
