import { gray } from 'tailwindcss/colors';
import TeamImageGradient from './team-image-gradient';

export default function TeamImageBlank() {
	return <TeamImageGradient colors={{ primaryHex: gray[500], secondaryHex: gray[700] }} />;
}
