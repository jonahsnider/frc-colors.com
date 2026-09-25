import { TextField } from '@radix-ui/themes';
import { useContext } from 'react';
import { TeamNumberContext } from '../contexts/team-number-context';

type Props = {
	invalidTeam: boolean;
};

export function SearchTeams({ invalidTeam }: Props) {
	const { teamNumber, teamNumberRaw, setTeamNumber } = useContext(TeamNumberContext);
	const valid = teamNumberRaw === '' || (teamNumber !== undefined && !invalidTeam);

	return (
		<TextField.Root
			size='3'
			autoFocus={true}
			type='text'
			placeholder='Enter a team number'
			onChange={(event) => {
				setTeamNumber(event.currentTarget.value);
			}}
			value={teamNumberRaw}
			color={valid ? undefined : 'red'}
			className='[view-transition-name:small-input]'
		/>
	);
}
