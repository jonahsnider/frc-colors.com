import { Callout, Text, Theme } from '@radix-ui/themes';
import type { PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
	icon?: React.ReactNode;
	color?: Callout.RootProps['color'];
}>;

export function Toast({ children, icon, color }: Props) {
	return (
		// Solid background is required so that sonner can properly stack multiple toasts
		<Theme hasBackground={true}>
			<Callout.Root className='shadow-5' color={color} variant='surface'>
				{icon && <Callout.Icon className='flex items-center justify-center'>{icon}</Callout.Icon>}

				<Callout.Text>
					<Text size='3'>{children}</Text>
				</Callout.Text>
			</Callout.Root>
		</Theme>
	);
}
