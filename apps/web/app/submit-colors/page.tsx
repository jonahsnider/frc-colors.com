'use client';

import { CreateColorSubmission } from '@frc-colors/api/src/color-submissions/dtos/color-submission.dto';
import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button, Card, Heading, Link, Text, Tooltip } from '@radix-ui/themes';
import { useState } from 'react';
import { toast } from 'sonner';
import { ColorInput } from '../components/color-input';
import { TeamInput } from '../components/team-input';
import { Toast } from '../components/toast';
import { trpc } from '../trpc';

export default function SubmitColors() {
	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [teamNumber, setTeamNumber] = useState<TeamNumber | undefined>(undefined);
	const [primaryColor, setPrimaryColor] = useState<HexColorCode | undefined>(undefined);
	const [secondaryColor, setSecondaryColor] = useState<HexColorCode | undefined>(undefined);

	const parsed = CreateColorSubmission.safeParse({
		teamNumber: teamNumber,
		primaryHex: primaryColor,
		secondaryHex: secondaryColor,
	});
	const isReady = parsed.success;

	const utils = trpc.useUtils();
	const mutation = trpc.colorSubmissions.createForTeam.useMutation({
		onSuccess: () => {
			utils.colorSubmissions.getAll.invalidate();
			utils.colorSubmissions.getAllForTeam.invalidate(teamNumber);
			toast.custom(() => (
				<Toast icon={<CheckIcon width='22' height='22' />} color='green'>
					Successfully submitted colors for team {teamNumber}
				</Toast>
			));
		},
	});

	const onClick = () => {
		if (!isReady) {
			return;
		}

		mutation.mutate(parsed.data);
	};

	return (
		<div className='flex justify-center items-center p-rx-4 w-full'>
			<Card className='flex flex-col gap-rx-4 [view-transition-name:main-card]'>
				<div>
					<Heading as='h1' size='5' className='pb-rx-1'>
						Submit colors for a team
					</Heading>

					<Text size='2' as='div'>
						<p className='pb-rx-1'>
							Hi! I'm <Link href='https://www.chiefdelphi.com/u/jonahsnider/summary'>Jonah</Link>, the creator of FRC
							Colors. Before you submit colors for a team, please be aware of the following:
						</p>

						<ul className='list-disc list-inside pl-rx-2'>
							<li>I'm the only person who works on developing the site</li>
							<li>I'm the only person who reviews color submissions</li>
							<li>I'm the only person who pays for the monthly server costs ($150 per year)</li>
						</ul>
					</Text>
				</div>

				<div className='flex flex-col gap-rx-1'>
					<Text size='2' weight='medium'>
						Team number
					</Text>
					<TeamInput teamNumber={rawTeam} onChange={setRawTeam} onValidChange={setTeamNumber} />
				</div>

				<div className='flex flex-col gap-rx-1'>
					<Text size='2' weight='medium'>
						Colors
					</Text>

					<div className='flex flex-col xs:flex-row gap-rx-3'>
						<ColorInput
							kind='primary'
							rawColor={rawPrimaryColor}
							onChange={setRawPrimaryColor}
							onValidChange={setPrimaryColor}
						/>
						<ColorInput
							kind='secondary'
							rawColor={rawSecondaryColor}
							onChange={setRawSecondaryColor}
							onValidChange={setSecondaryColor}
						/>
					</div>
				</div>

				<div className='flex w-full justify-end'>
					<Tooltip content='Already submitted' hidden={!mutation.isSuccess}>
						<Button
							variant='soft'
							type='button'
							onClick={onClick}
							// disabled={!isReady || mutation.isPending || mutation.isSuccess}
							loading={mutation.isPending}
							className='max-w-min'
							disabled={!isReady || mutation.isPending || mutation.isSuccess}
						>
							{mutation.isError ? 'An error occurred' : 'Submit'}
						</Button>
					</Tooltip>
				</div>
			</Card>
		</div>
	);
}
