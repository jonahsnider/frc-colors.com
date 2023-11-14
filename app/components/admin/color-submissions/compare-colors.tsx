import { Schema } from '@/app/api/_lib/db/index';
import { ColorSubmissionSchema } from '@/app/api/_lib/teams/color-submissions/dtos/color-submission.dto';
import { V1TeamSchema } from '@/app/api/_lib/teams/dtos/v1/team.dto';
import { CheckBadgeIcon } from '@heroicons/react/20/solid';
import ColorSwatch from '../../team-card/color-swatch';

type Props = {
	loading: boolean;
	team: V1TeamSchema | undefined;
	submission: ColorSubmissionSchema;
};

export default function CompareColors({ loading, submission, team }: Props) {
	const primaryBefore = loading ? undefined : team?.colors.primaryHex;
	const secondaryBefore = loading ? undefined : team?.colors.secondaryHex;
	const verificationBadge = team?.colors.verified ? (
		<CheckBadgeIcon className='h-6' color={team.colors?.primaryHex} stroke={team.colors?.secondaryHex} />
	) : (
		<></>
	);

	return (
		<>
			{submission.status !== Schema.VerificationRequestStatus.Finished && (
				<div>
					<div className='flex justify-between'>
						<p>Before:</p>
						{verificationBadge}
					</div>

					<div className='flex gap-x-2'>
						{primaryBefore && <ColorSwatch hex={primaryBefore} />}
						{secondaryBefore && <ColorSwatch hex={secondaryBefore} />}
					</div>
				</div>
			)}
			<div>
				<p>After:</p>
				<div className='flex gap-x-2'>
					{<ColorSwatch hex={submission.primaryHex} />}
					{<ColorSwatch hex={submission.secondaryHex} />}
				</div>
			</div>
		</>
	);
}
