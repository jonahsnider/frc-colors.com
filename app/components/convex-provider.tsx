'use client';

import { ConvexProvider, ConvexReactClient } from 'convex/react';

const url = process.env.NEXT_PUBLIC_CONVEX_URL;
if (!url) throw new Error('NEXT_PUBLIC_CONVEX_URL is not defined');

const client = new ConvexReactClient(url);

export function AppConvexProvider({ children }: { children: React.ReactNode }) {
	return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
