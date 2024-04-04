import { sage, sageDark } from '@radix-ui/colors';
import { useTheme } from 'next-themes';
import { TeamImageGradient } from './team-image-gradient';

export function TeamImageBlank() {
	const { resolvedTheme } = useTheme();

	const colors = resolvedTheme === 'dark' ? sageDark : sage;

	return (
		<TeamImageGradient
			colors={{
				primary: colors.sage6,
				secondary: colors.sage3,
			}}
		/>
	);
}
