import { gray } from 'tailwindcss/colors';
import TeamImageGradient from './team-image-gradient';

export default function TeamImageBlank() {
	return (
		<TeamImageGradient
			colors={{
				primary: gray[500],
				secondary: gray[700],
			}}
		/>
	);
}
