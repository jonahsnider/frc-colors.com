import Link from 'next/link';
import { NavbarItem } from './types';

export default function NavbarLink({ item }: { item: NavbarItem }) {
	return (
		<li className='px-1.5 py-0.5 self-center rounded transition-colors hover:bg-neutral-700 active:bg-neutral-600'>
			<Link href={item.href} className='text-lg'>
				{item.content}
			</Link>
		</li>
	);
}
