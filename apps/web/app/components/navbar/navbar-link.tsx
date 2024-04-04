import { Link } from '@radix-ui/themes';
import NextLink from 'next/link';
import type { NavbarItem } from './types';

export function NavbarLink({ item }: { item: NavbarItem }) {
	return (
		<li className='flex justify-center items-center'>
			<Link asChild={true} size='4'>
				<NextLink href={item.href}>{item.content}</NextLink>
			</Link>
		</li>
	);
}
