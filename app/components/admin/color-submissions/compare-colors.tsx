import { Schema } from '@/app/api/_lib/db/index';
import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import { V0ColorsSchema } from '@/app/api/_lib/teams/dtos/v0/team.dto';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import ColorSwatch from '../../team-card/color-swatch';

type Props = {
	loading: boolean;
	colors: V0ColorsSchema | undefined;
	submission: ColorSubmissionSchema;
};

export default function CompareColors({ loading, submission, colors }: Props) {
	const primaryBefore = loading ? undefined : colors?.primaryHex;
	const secondaryBefore = loading ? undefined : colors?.secondaryHex;
	const verificationBadge = colors?.verified ? (
		<CheckBadgeIcon className='h-6' color={colors?.primaryHex} stroke={colors?.secondaryHex} />
	) : (
		<></>
	);

	return (
		<>
			{submission.status !== Schema.VerificationRequestStatus.Finished && (
				<div className='flex flex-col gap-y-1'>
					<div className='flex justify-between'>
						<p>Before:</p>
						{verificationBadge}
					</div>

					<div className='flex gap-x-2'>
						{primaryBefore && <ColorSwatch hex={primaryBefore} />}
						{!primaryBefore && <p className='bg-neutral-700 p-2 w-full rounded text-center'>None</p>}
						{secondaryBefore && <ColorSwatch hex={secondaryBefore} />}
					</div>
				</div>
			)}
			<div className='flex flex-col gap-y-1'>
				<p>After:</p>
				<div className='flex gap-x-2'>
					{<ColorSwatch hex={submission.primaryHex} />}
					{<ColorSwatch hex={submission.secondaryHex} />}
				</div>
			</div>
		</>
	);
}
