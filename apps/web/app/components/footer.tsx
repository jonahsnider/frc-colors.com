import Link from 'next/link';

export function Footer() {
	return (
		<footer className='text-center py-5 lg:pt-10 text-neutral-200 w-full shrink-0 lg:text-lg xl:text-xl'>
			<p>
				<Link className='underline' href='/submit-colors'>
					Submit colors for a team
				</Link>
			</p>

			<p>
				<a className='underline' href='https://status.frc-colors.com'>
					Status page
				</a>
			</p>

			<p>
				FRC Colors is licensed under{' '}
				<a className='underline' href='https://www.apache.org/licenses/LICENSE-2.0'>
					Apache 2.0
				</a>
			</p>

			<p>
				Created by{' '}
				<a className='underline' href='https://jonahsnider.com'>
					Jonah Snider
				</a>
			</p>
		</footer>
	);
}
