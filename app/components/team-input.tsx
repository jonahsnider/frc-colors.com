'use client';

import clsx from 'clsx';
import { useState } from 'react';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';
import { useTeam } from '../hooks/use-team';

type Props = {
	teamNumber: string;
	onChange: (teamNumberRaw: string) => void;
	onValidChange: (teamNumber: TeamNumberSchema | undefined) => void;
	className?: string;
};

export default function TeamInput({ onChange, onValidChange, className, teamNumber }: Props) {
	const valid = teamNumber === '' || TeamNumberSchema.safeParse(teamNumber).success;

	const parsedTeam = TeamNumberSchema.safeParse(teamNumber);

	const team = useTeam(parsedTeam.success ? parsedTeam.data : undefined);

	const [lastAvatarUrl, setLastAvatarUrl] = useState<string | undefined>(undefined);
	const [backgroundRed, setBackgroundRed] = useState(false);

	if (team.team?.avatarUrl && team.team.avatarUrl !== lastAvatarUrl) {
		setLastAvatarUrl(team.team.avatarUrl);
	}

	return (
		<div className={clsx('rounded relative w-full md:w-auto md:max-w-min', className)}>
			<input
				className={clsx(
					'w-full md:w-auto transition-all h-16 rounded p-4 outline-none border-4',
					{
						'border-red-400': !valid,
						'border-transparent': valid,
					},
					className,
				)}
				placeholder='Team number'
				type='text'
				name='team'
				onChange={(event) => {
					// @ts-expect-error bun-types breaks this
					onChange(event.target.value);

					// @ts-expect-error bun-types breaks this
					const parsed = TeamNumberSchema.safeParse(event.target.value);

					if (parsed.success) {
						onValidChange(parsed.data);
					} else {
						onValidChange(undefined);
					}
				}}
				value={teamNumber}
			/>

			<button type='button' onClick={() => setBackgroundRed((old) => !old)}>
				<img
					src={lastAvatarUrl}
					alt={`Team ${teamNumber} avatar`}
					style={{
						imageRendering: 'pixelated',
					}}
					className={clsx('h-10 w-10 p-1 right-2 top-3 rounded absolute transition-all', {
						'opacity-0': !(valid && team.team?.avatarUrl),
						'bg-[#0066B3]': !backgroundRed,
						'bg-[#ED1C24]': backgroundRed,
					})}
				/>
			</button>
		</div>
	);
}
