'use client';

import clsx from 'clsx';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';

type Props = {
	teamNumber: string;
	onChange: (teamNumberRaw: string) => void;
	onValidChange: (teamNumber: TeamNumberSchema | undefined) => void;
	className?: string;
};

export default function TeamInput({ onChange, onValidChange, className, teamNumber }: Props) {
	const valid = teamNumber === '' || TeamNumberSchema.safeParse(teamNumber).success;

	return (
		<input
			className={clsx(
				'max-w-min transition-all h-14 rounded p-4 outline-none border-4',
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
	);
}
