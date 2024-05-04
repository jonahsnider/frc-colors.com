import { Link, Separator, Strong, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { Link as NextLink } from 'next-view-transitions';
import { Children, Fragment, type PropsWithChildren } from 'react';

function FooterRow({ children, vertical }: PropsWithChildren<{ vertical: boolean }>) {
	const childrenArray = Children.toArray(children);

	return (
		<div
			className={clsx('flex justify-center items-center gap-x-rx-2 text-center', {
				'flex-col xs:flex-row': vertical,
			})}
		>
			{childrenArray.map((child, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: This won't get rerendered so it's probably fine to just use index
				<Fragment key={index}>
					{child}
					{index < childrenArray.length - 1 && <Separator orientation={{ initial: 'horizontal', xs: 'vertical' }} />}
				</Fragment>
			))}
		</div>
	);
}

export function Footer() {
	return (
		<footer className='flex flex-col justify-center items-center shrink-0 py-rx-2 max-xs:gap-rx-2'>
			<FooterRow vertical={false}>
				<Strong>Other projects</Strong>
				<Link href='https://frc.sh/?utm_source=frc_colors'>frc.sh</Link>
				<Link href='https://scores.frc.sh/?utm_source=frc_colors'>scores.frc.sh</Link>
			</FooterRow>

			<FooterRow vertical={true}>
				<Link asChild={true}>
					<NextLink href='/submit-colors'>Submit colors for a team</NextLink>
				</Link>

				<Link href='https://status.frc-colors.com'>Status page</Link>

				<Text>
					Created by <Link href='https://jonahsnider.com'>Jonah Snider</Link>
				</Text>
			</FooterRow>
		</footer>
	);
}
