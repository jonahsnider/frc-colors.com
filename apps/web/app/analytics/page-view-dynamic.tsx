'use client';

import dynamic from 'next/dynamic';

export const PageView = dynamic(async () => import('./page-view'), {
	ssr: false,
});
