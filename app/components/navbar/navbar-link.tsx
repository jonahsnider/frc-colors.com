import { Link } from '@radix-ui/themes';
import { Link as NextLink } from 'next-view-transitions';
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
