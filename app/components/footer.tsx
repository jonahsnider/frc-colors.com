import Link from 'next/link';

export default function Footer() {
	return (
		<footer className='text-center py-5 text-neutral-200 absolute w-full bottom-0'>
			<p>
				<Link className='underline' href='/submit-colors'>
					Submit colors for a team
				</Link>
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
