import type { PropsWithChildren } from 'react';

export function H2({ children }: PropsWithChildren) {
	return <h2 className='text-2xl lg:text-3xl font-bold'>{children}</h2>;
}
