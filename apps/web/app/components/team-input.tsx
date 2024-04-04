'use client';

import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { TextField } from '@radix-ui/themes';

type Props = {
	teamNumber: string;
	onChange: (teamNumberRaw: string) => void;
	onValidChange: (teamNumber: TeamNumber | undefined) => void;
};

export function TeamInput({ onChange, onValidChange, teamNumber }: Props) {
	const valid = teamNumber === '' || TeamNumber.safeParse(teamNumber).success;

	return (
		<TextField.Root
			type='text'
			placeholder='Team number'
			color={valid ? undefined : 'red'}
			onChange={(event) => {
				onChange(event.target.value);

				const parsed = TeamNumber.safeParse(event.target.value);

				if (parsed.success) {
					onValidChange(parsed.data);
				} else {
					onValidChange(undefined);
				}
			}}
			value={teamNumber}
		/>
	);
}
