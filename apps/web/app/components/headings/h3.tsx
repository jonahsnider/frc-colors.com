import { PropsWithChildren } from 'react';

export default function H3({ children }: PropsWithChildren) {
	return <h3 className='text-xl font-bold'>{children}</h3>;
}
