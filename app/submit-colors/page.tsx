'use client';

import { CheckIcon } from '@radix-ui/react-icons';
import { Button, Card, Heading, Link, Text, Tooltip } from '@radix-ui/themes';
import { useMutation } from 'convex/react';
import { useState } from 'react';
import { toast } from 'sonner';
import { api } from '@/convex/_generated/api';
import { CreateColorSubmission } from '@/src/color-submissions/dtos/color-submission.dto';
import type { HexColorCode } from '@/src/colors/dtos/colors.dto';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';
import { ColorInput } from '../components/color-input';
import { TeamInput } from '../components/team-input';
import { Toast } from '../components/toast';

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

	const createSubmission = useMutation(api.colorSubmissions.create);
	const [status, setStatus] = useState<'idle' | 'pending' | 'success' | 'error'>('idle');

	const onClick = async () => {
		if (!parsed.success) return;
		setStatus('pending');
		try {
			await createSubmission(parsed.data);
			setStatus('success');
			toast.custom(() => (
				<Toast icon={<CheckIcon width='22' height='22' />} color='green'>
					Successfully submitted colors for team {teamNumber}
				</Toast>
			));
		} catch (error) {
			setStatus('error');
			console.error('Error while submitting colors:', error);
		}
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
					<Tooltip content='Already submitted' hidden={status !== 'success'}>
						<Button
							variant='soft'
							type='button'
							onClick={onClick}
							loading={status === 'pending'}
							className='max-w-min'
							disabled={!isReady || status === 'pending' || status === 'success'}
						>
							{status === 'error' ? 'An error occurred' : 'Submit'}
						</Button>
					</Tooltip>
				</div>
			</Card>
		</div>
	);
}
