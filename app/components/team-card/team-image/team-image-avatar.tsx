'use client';

import clsx from 'clsx';
import { useState } from 'react';

enum BackgroundColor {
	None = 0,
	Red = 1,
	Blue = 2,
}

export default function TeamImageAvatar({ avatarUrl }: { avatarUrl: string }) {
	const [backgroundColor, setBackgroundColor] = useState<BackgroundColor>(BackgroundColor.None);

	const cycleBackgroundColor = () => {
		if (backgroundColor === BackgroundColor.Blue) {
			setBackgroundColor(BackgroundColor.None);
		} else {
			setBackgroundColor(backgroundColor + 1);
		}
	};

	return (
		<button
			type='button'
			onClick={cycleBackgroundColor}
			className={clsx('transition-all rounded', {
				'bg-[#ED1C24]': backgroundColor === BackgroundColor.Red,
				'bg-[#0066B3]': backgroundColor === BackgroundColor.Blue,
			})}
		>
			<img
				src={avatarUrl}
				alt='Team avatar'
				className='p-1'
				style={{
					imageRendering: 'pixelated',
				}}
				height={192}
				width={192}
			/>
		</button>
	);
}
