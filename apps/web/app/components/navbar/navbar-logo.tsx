import { Text } from '@radix-ui/themes';
import Image from 'next/image';
import { Link } from 'next-view-transitions';
import frcColors from './frc-colors.svg';

export function NavbarLogo() {
	return (
		<Link href='/'>
			<div className='flex gap-x-4'>
				<div className='relative h-8 w-8'>
					<Image fill={true} src={frcColors} alt='FRC Colors logo' priority={true} />
				</div>

				<Text size='6' className='self-center' weight='bold'>
					FRC Colors
				</Text>
			</div>
		</Link>
	);
}
