'use client';

import clsx from 'clsx';
import Image from 'next/image';
import { useState } from 'react';

enum BackgroundColor {
	None = 0,
	Red = 1,
	Blue = 2,
}

export default function TeamImageAvatar({ avatarUrl }: { avatarUrl: string }) {
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(BackgroundColor.None);

	const cycleBackgroundColor = () => {
		setBackgroundColor(backgroundColor === BackgroundColor.Blue ? BackgroundColor.None : backgroundColor + 1);
	};

	return (
		<button
			type='button'
			onClick={cycleBackgroundColor}
			className={clsx('transition-colors rounded', {
				'bg-[#ED1C24]': backgroundColor === BackgroundColor.Red,
				'bg-[#0066B3]': backgroundColor === BackgroundColor.Blue,
			})}
		>
			<Image
				src={avatarUrl}
				unoptimized={true}
				priority={true}
				alt='Team avatar'
				className='p-1 h-48 w-48'
				style={{
					imageRendering: 'pixelated',
				}}
				height={40}
				width={40}
			/>
		</button>
	);
}
