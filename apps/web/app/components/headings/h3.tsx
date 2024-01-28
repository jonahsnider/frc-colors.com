import { PropsWithChildren } from 'react';

export function H3({ children }: PropsWithChildren) {
	return <h3 className='text-xl font-bold'>{children}</h3>;
}
