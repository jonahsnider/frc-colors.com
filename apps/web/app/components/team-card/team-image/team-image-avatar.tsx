'use client';

import { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import clsx from 'clsx';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import LoadingSkeleton from '../../loading-skeleton';
import styles from './team-image-avatar.module.css';
import TeamImageBlank from './team-image-blank';
import TeamImageGradient from './team-image-gradient';

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

type ImageStates = ReadonlyMap<string, ImageState>;

export default function TeamImageAvatar({ colors, avatarUrl }: Props) {
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(BackgroundColor.None);

	const cycleBackgroundColor = () => {
		setBackgroundColor(backgroundColor === BackgroundColor.Blue ? BackgroundColor.None : backgroundColor + 1);
	};

	// Using a Map for this helps avoid a race condition where the avatar URL changes before the previous avatar loads
	const [imageStates, setImageStates] = useState<ImageStates>(new Map());
	const imageStateForUrl = imageStates.get(avatarUrl) ?? 'loading';

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
	useEffect(() => {
		if (!imageStates.has(avatarUrl)) {
			setImageStates(new Map(imageStates).set(avatarUrl, 'loading'));
		}
	}, [avatarUrl]);

	const imageHidden = imageStateForUrl !== 'success';
	return (
		<button
			type='button'
			onClick={cycleBackgroundColor}
			disabled={imageHidden}
			className={clsx('transition-colors rounded relative', {
				'bg-neutral-800': backgroundColor === BackgroundColor.None,
				'bg-[#ED1C24]': backgroundColor === BackgroundColor.Red,
				'bg-[#0066B3]': backgroundColor === BackgroundColor.Blue,
			})}
		>
			{/* Always display colors as the base layer */}
			{colors && (
				<TeamImageGradient
					colors={colors}
					className={clsx({
						'opacity-0': imageStateForUrl === 'success',
					})}
				/>
			)}
			{/* If we don't have colors and the avatar is loading, show the loading indicator */}
			{!colors && imageStateForUrl === 'loading' && (
				<LoadingSkeleton className='w-48 h-48 rounded bg-gradient-to-br from-gray-500 to-gray-700' bar={false} />
			)}
			{/* If we dont' have colors and there is no avatar, display a blank avatar */}
			{!colors && imageStateForUrl === 'error' && <TeamImageBlank />}
			{/* If the image is loading or successful, render it */}
			{imageStateForUrl !== 'error' && (
				<Image
					src={avatarUrl}
					unoptimized={true}
					priority={true}
					alt='Team avatar'
					className={clsx('p-1 h-48 w-48 transition-opacity', styles.image, {
						// Hide the image until it's loaded
						'opacity-0': imageHidden,
						// Use absolute positioning if the color base layer is being rendered (colors or the loading indicator)
						'absolute top-0 left-0': Boolean(colors) || imageStateForUrl === 'loading',
					})}
					height={40}
					width={40}
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
	);
}
