import Link from 'next/link';
import NavbarLogo from './navbar-logo';

type NavbarItem = {
	content: string;
	href: string;
};

const items: NavbarItem[] = [
	{
		content: 'API Docs',
		href: 'https://github.com/jonahsnider/frc-colors#api-usage',
	},
	{
		content: 'GitHub',
		href: 'https://github.com/jonahsnider/frc-colors',
	},
];

export default function Navbar() {
	return (
		<nav className='w-full flex justify-between bg-neutral-800 text-zinc-100 px-4 py-2'>
			<NavbarLogo />

			<ul className='flex flex-row space-x-2'>
				{items.map((item, index) => {
					return (
						<li
							key={item.content}
							className='px-1.5 py-0.5 self-center rounded transition-colors hover:bg-neutral-700 active:bg-neutral-600'
						>
							<Link href={item.href} className='text-lg'>
								{item.content}
							</Link>
						</li>
					);
				})}
			</ul>
		</nav>
	);
}
