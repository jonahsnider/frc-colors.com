'use client';

import { TextField } from '@radix-ui/themes';
import { useContext } from 'react';
import { TeamNumber } from '@/src/teams/dtos/team-number.dto';
import { TeamNumberContext } from '../contexts/team-number-context';

type Props = {
	invalidTeam: boolean;
};

export function SearchTeams({ invalidTeam }: Props) {
	const { teamNumber, setTeamNumber } = useContext(TeamNumberContext);
	const valid = teamNumber === undefined || (TeamNumber.safeParse(teamNumber).success && !invalidTeam);

	return (
		<TextField.Root
			size='3'
			autoFocus={true}
			type='text'
			placeholder='Enter a team number'
			onChange={(event) => {
				setTeamNumber(event.currentTarget.value);
			}}
			value={teamNumber ?? ''}
			color={valid ? undefined : 'red'}
			className='[view-transition-name:small-input]'
		/>
	);
}
