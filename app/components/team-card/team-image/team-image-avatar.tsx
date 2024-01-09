'use client';

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
	colors?: {
		primaryHex: string;
		secondaryHex: string;
	};
	avatarUrl: string;
};

type ImageState = 'loading' | 'success' | 'error';

export default function TeamImageAvatar({ colors, avatarUrl }: Props) {
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(BackgroundColor.None);

	const cycleBackgroundColor = () => {
		setBackgroundColor(backgroundColor === BackgroundColor.Blue ? BackgroundColor.None : backgroundColor + 1);
	};

	const [imageState, setImageState] = useState<ImageState>('loading');

	// biome-ignore lint/correctness/useExhaustiveDependencies: This is intentional
	useEffect(() => {
		setImageState('loading');
	}, [avatarUrl]);

	return (
		<button
			type='button'
			onClick={cycleBackgroundColor}
			className={clsx('transition-colors rounded relative', {
				'bg-neutral-800': backgroundColor === BackgroundColor.None,
				'bg-[#ED1C24]': backgroundColor === BackgroundColor.Red,
				'bg-[#0066B3]': backgroundColor === BackgroundColor.Blue,
			})}
		>
			{/* Always display colors as the base layer */}
			{colors && (
				<TeamImageGradient
					colors={imageState === 'loading' ? colors : { primaryHex: 'transparent', secondaryHex: 'transparent' }}
				/>
			)}
			{/* If we don't have colors and the avatar is loading, show the loading indicator */}
			{!colors && imageState === 'loading' && (
				<LoadingSkeleton className='w-48 h-48 rounded bg-gradient-to-br from-gray-500 to-gray-700' bar={false} />
			)}
			{/* If we dont' have colors and there is no avatar, display a blank avatar */}
			{!colors && imageState === 'error' && <TeamImageBlank />}
			{/* If the image is loading or successful, render it */}
			{imageState !== 'error' && (
				<Image
					src={avatarUrl}
					unoptimized={true}
					priority={true}
					alt='Team avatar'
					className={clsx('p-1 h-48 w-48 transition-opacity', styles.image, {
						// Hide the image until it's loaded
						'opacity-0': imageState !== 'success',
						// Use absolute positioning if the color base layer is being rendered (colors or the loading indicator)
						'absolute top-0 left-0': Boolean(colors) || imageState === 'loading',
					})}
					height={40}
					width={40}
					onLoad={() => setImageState('success')}
					onError={() => setImageState('error')}
				/>
			)}
		</button>
	);
}
