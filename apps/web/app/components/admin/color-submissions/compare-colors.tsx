import { ColorSubmission } from '@frc-colors/api/src/color-submissions/dtos/color-submission.dto';
import { TeamColors } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import { ColorSwatch } from '../../team-card/color-swatch';

type Props = {
	loading: boolean;
	colors: TeamColors | undefined;
	submission: ColorSubmission;
};

export function CompareColors({ loading, submission, colors }: Props) {
	const primaryBefore = loading ? undefined : colors?.primary;
	const secondaryBefore = loading ? undefined : colors?.secondary;
	const verificationBadge = colors?.verified ? (
		<CheckBadgeIcon className='h-6' color={colors?.primary} stroke={colors?.secondary} />
	) : undefined;

	const colorsAreDifferent = submission.primaryHex !== primaryBefore || submission.secondaryHex !== secondaryBefore;

	return (
		<>
			{colorsAreDifferent && (
				<div className='flex flex-col gap-1'>
					<div className='flex justify-between'>
						<p className='text-lg'>Current:</p>
						{verificationBadge}
					</div>

					<div className='flex gap-2'>
						{primaryBefore && <ColorSwatch hex={primaryBefore} />}
						{!primaryBefore && <p className='bg-neutral-700 p-2 w-full rounded text-center text-lg'>None</p>}
						{secondaryBefore && <ColorSwatch hex={secondaryBefore} />}
					</div>
				</div>
			)}
			<div className='flex flex-col gap-1'>
				<p className='text-start text-lg'>Proposed:</p>
				<div className='flex gap-2'>
					<ColorSwatch hex={submission.primaryHex} />
					<ColorSwatch hex={submission.secondaryHex} />
				</div>
			</div>
		</>
	);
}
