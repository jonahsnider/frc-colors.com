import Image from 'next/image';
import Link from 'next/link';
import frcColors from './frc-colors.svg';

export function NavbarLogo() {
	return (
		<Link href='/'>
			<div className='flex gap-x-4 rounded p-2 lg:p-3 transition-colors hover:bg-neutral-700 active:bg-neutral-600'>
				<div className='relative h-8 w-8 lg:h-10 lg:w-10'>
					<Image fill={true} src={frcColors} alt='FRC Colors logo' priority={true} />
				</div>

				<p className='text-white text-lg lg:text-2xl self-center'>FRC Colors</p>
			</div>
		</Link>
	);
}
