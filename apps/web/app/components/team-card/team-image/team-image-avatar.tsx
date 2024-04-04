'use client';

import type { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { Skeleton } from '@radix-ui/themes';
import { useMap } from '@uidotdev/usehooks';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import styles from './team-image-avatar.module.css';
import { TeamImageBlank } from './team-image-blank';
import { TeamImageGradient } from './team-image-gradient';

enum BackgroundColor {
	None = 0,
	Red = 1,
	Blue = 2,
}

type Props = {
	colors?: TeamColors;
	avatarUrl: string;
};

type ImageState = 'loading' | 'success' | 'error';

type ImageStates = Map<string, ImageState>;

export function TeamImageAvatar({ colors, avatarUrl }: Props) {
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(BackgroundColor.None);

	const cycleBackgroundColor = () => {
		setBackgroundColor(backgroundColor === BackgroundColor.Blue ? BackgroundColor.None : backgroundColor + 1);
	};

	// Using a Map for this helps avoid a race condition where the avatar URL changes before the previous avatar loads
	const imageStates: ImageStates = useMap();
	const imageStateForUrl = imageStates.get(avatarUrl) ?? 'loading';

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
	useEffect(() => {
		if (!imageStates.has(avatarUrl)) {
			imageStates.set(avatarUrl, 'loading');
		}
	}, [avatarUrl]);

	const imageHidden = imageStateForUrl !== 'success';

	return (
		<Skeleton width='192px' height='192px' loading={imageStateForUrl === 'loading' && !colors}>
			<button
				type='button'
				onClick={cycleBackgroundColor}
				disabled={imageHidden}
				className={clsx('transition-colors rounded-3 relative', {
					'bg-neutral-800': backgroundColor === BackgroundColor.None,
					'bg-[#ED1C24]': backgroundColor === BackgroundColor.Red,
					'bg-[#0066B3]': backgroundColor === BackgroundColor.Blue,
				})}
			>
				{colors && (
					<TeamImageGradient
						colors={colors}
						className={clsx('top-0 left-0 transition-opacity opacity-0', {
							'opacity-100': imageHidden,
						})}
					/>
				)}

				{!colors && imageStateForUrl === 'error' && <TeamImageBlank />}

				{imageStateForUrl !== 'error' && (
					<Image
						src={avatarUrl}
						unoptimized={true}
						priority={true}
						alt='Team avatar'
						className={clsx('p-1 h-48 w-48 transition-all top-0 left-0 absolute', styles.image, {
							'opacity-0': imageHidden,
						})}
						height={40}
						width={40}
						onLoad={(event) => {
							const path = new URL((event.target as unknown as { src: string }).src).pathname;
							imageStates.set(path, 'success');
						}}
						onError={(event) => {
							const path = new URL((event.target as unknown as { src: string }).src).pathname;
							imageStates.set(path, 'error');
						}}
					/>
				)}
			</button>
		</Skeleton>
	);
}
