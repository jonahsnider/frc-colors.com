import type { PropsWithChildren } from 'react';

export function H3({ children }: PropsWithChildren) {
	return <h3 className='text-xl font-bold lg:text-2xl'>{children}</h3>;
}
