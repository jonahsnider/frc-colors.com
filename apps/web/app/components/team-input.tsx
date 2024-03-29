'use client';

import clsx from 'clsx';
import { useEffect, useState } from 'react';

import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import styles from './team-input.module.css';
import { getTeamAvatarUrl } from './util/team-avatar-url';

type Props = {
	teamNumber: string;
	onChange: (teamNumberRaw: string) => void;
	onValidChange: (teamNumber: TeamNumber | undefined) => void;
	className?: string;
};

type ImageState = 'loading' | 'success' | 'error';

type ImageStates = ReadonlyMap<string, ImageState>;

export function TeamInput({ onChange, onValidChange, className, teamNumber }: Props) {
	const valid = teamNumber === '' || TeamNumber.safeParse(teamNumber).success;

	const [lastAvatarUrl, setLastAvatarUrl] = useState<string | undefined>(undefined);
	const [backgroundRed, setBackgroundRed] = useState(false);

	const avatarUrl = TeamNumber.safeParse(teamNumber).success ? getTeamAvatarUrl(teamNumber) : undefined;

	if (avatarUrl && avatarUrl !== lastAvatarUrl) {
		setLastAvatarUrl(avatarUrl);
	}

	// Using a Map for this helps avoid a race condition where the avatar URL changes before the previous avatar loads
	const [imageStates, setImageStates] = useState<ImageStates>(new Map());
	const imageStateForUrl = (avatarUrl ? imageStates.get(avatarUrl) : undefined) ?? 'loading';

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
	useEffect(() => {
		if (avatarUrl && !imageStates.has(avatarUrl)) {
			setImageStates(new Map(imageStates).set(avatarUrl, 'loading'));
		}
	}, [avatarUrl]);

	const buttonHidden = imageStateForUrl !== 'success' || !valid;
	return (
		<div className={clsx('rounded relative w-full md:w-auto md:max-w-min text-lg xl:text-xl', className)}>
			<input
				className={clsx(
					'w-full md:w-auto transition-all rounded p-4 outline-none border-4',
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

			<button type='button' onClick={() => setBackgroundRed((old) => !old)} disabled={buttonHidden}>
				{imageStateForUrl !== 'error' && (
					<img
						src={lastAvatarUrl}
						alt={`Team ${teamNumber} avatar`}
						className={clsx('h-10 w-10 p-1 right-2 top-3 rounded absolute transition-all', styles.image, {
							'opacity-0': buttonHidden,
							'bg-[#0066B3]': !backgroundRed,
							'bg-[#ED1C24]': backgroundRed,
						})}
						onLoad={(event) => {
							const path = new URL((event.target as unknown as { src: string }).src).pathname;
							setImageStates(new Map(imageStates).set(path, 'success'));
						}}
						onError={(event) => {
							const path = new URL((event.target as unknown as { src: string }).src).pathname;
							setImageStates(new Map(imageStates).set(path, 'error'));
						}}
					/>
				)}
			</button>
		</div>
	);
}
