import { Link } from '@radix-ui/themes';
import { Link as RouterLink } from '@tanstack/react-router';
import type { NavbarItem } from './types';

export function NavbarLink({ item }: { item: NavbarItem }) {
	return (
		<li className='flex justify-center items-center'>
			<Link asChild={true} size='4'>
				{item.href === '/admin' ? (
					<RouterLink to='/admin' viewTransition={true}>
						{item.content}
					</RouterLink>
				) : (
					<a href={item.href}>{item.content}</a>
				)}
			</Link>
		</li>
	);
}
