import { Container } from '@radix-ui/themes';
import { AdminNavbarLink } from './admin-navbar-links';
import { NavbarLink } from './navbar-link';
import { NavbarLogo } from './navbar-logo';

const DEFAULT_NAVBAR_ITEMS = [
	{
		content: 'API Docs',
		href: 'https://github.com/jonahsnider/frc-colors#api-usage',
	},
	{
		content: 'GitHub',
		href: 'https://github.com/jonahsnider/frc-colors',
	},
];

export function Navbar() {
	return (
		<nav className='bg-sage-2 shadow-2'>
			<Container size='3'>
				<div className='flex w-full justify-between p-rx-3'>
					<NavbarLogo />

					<ul className='flex flex-row gap-rx-3'>
						{DEFAULT_NAVBAR_ITEMS.map((item) => (
							<NavbarLink key={item.content} item={item} />
						))}
						<AdminNavbarLink />
					</ul>
				</div>
			</Container>
		</nav>
	);
}
