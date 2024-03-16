import Link from 'next/link';
import type { NavbarItem } from './types';

export function NavbarLink({ item }: { item: NavbarItem }) {
	return (
		<li className='flex items-center justify-center'>
			<Link
				href={item.href}
				className='text-lg px-1.5 py-0.5 lg:px-3 lg:py-1.5 lg:text-xl self-center rounded transition-colors hover:bg-neutral-700 active:bg-neutral-600'
			>
				{item.content}
			</Link>
		</li>
	);
}
