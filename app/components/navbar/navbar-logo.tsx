import { Text } from '@radix-ui/themes';
import { Link } from '@tanstack/react-router';
import frcColors from './frc-colors.svg';

export function NavbarLogo() {
	return (
		<Link to='/' viewTransition={true}>
			<div className='flex gap-x-4'>
				<div className='relative h-8 w-8'>
					<img src={frcColors} alt='FRC Colors logo' className='h-full w-full' />
				</div>

				<Text size='6' className='self-center' weight='bold'>
					FRC Colors
				</Text>
			</div>
		</Link>
	);
}
