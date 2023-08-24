export default function TeamImageGradient({ colors }: { colors: { primaryHex: string; secondaryHex: string } }) {
	return (
		<div
			className='rounded transition-colors w-48 h-48'
			style={{
				backgroundImage: `linear-gradient(to bottom right, ${colors.primaryHex}, ${colors.secondaryHex})`,
			}}
		/>
	);
}
