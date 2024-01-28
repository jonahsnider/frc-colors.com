import Link from 'next/link';
import { NavbarItem } from './types';

export function NavbarLink({ item }: { item: NavbarItem }) {
	return (
		<li className='flex items-center justify-center'>
			<Link
				href={item.href}
				className='text-lg px-1.5 py-0.5 self-center rounded transition-colors hover:bg-neutral-700 active:bg-neutral-600'
			>
				{item.content}
			</Link>
		</li>
	);
}
