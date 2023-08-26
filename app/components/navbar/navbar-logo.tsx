import Image from 'next/image';
import Link from 'next/link';
import frcColors from './frc-colors.svg';

export default function NavbarLogo() {
	return (
		<Link href='/'>
			<div className='flex space-x-4 rounded px-2 py-2 transition-colors hover:bg-neutral-700 active:bg-neutral-600'>
				<Image src={frcColors} height={32} alt='FRC Colors logo' priority />

				<p className='text-white text-lg self-center'>FRC Colors</p>
			</div>
		</Link>
	);
}
