import type { PropsWithChildren } from 'react';

export function H1({ children }: PropsWithChildren) {
	return <h1 className='text-4xl lg:text-5xl font-bold my-6 text-center'>{children}</h1>;
}
