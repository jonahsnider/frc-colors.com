'use client';

import type { HexColorCode } from '@frc-colors/api/src/colors/dtos/colors.dto';
import { SetColorsInput } from '@frc-colors/api/src/teams/dtos/set-colors-input.dto';
import type { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { CheckIcon } from '@radix-ui/react-icons';
import { Button, Card, Heading } from '@radix-ui/themes';
import { useState } from 'react';
import { toast } from 'sonner';
import type { PartialDeep } from 'type-fest';
import { ColorInput } from '@/app/components/color-input';
import { TeamCard } from '@/app/components/team-card/team-card';
import { TeamInput } from '@/app/components/team-input';
import { Toast } from '@/app/components/toast';
import { trpc } from '@/app/trpc';

export function SetColors() {
	const [rawTeam, setRawTeam] = useState<string>('');
	const [rawPrimaryColor, setRawPrimaryColor] = useState<string>('');
	const [rawSecondaryColor, setRawSecondaryColor] = useState<string>('');

	const [team, setTeam] = useState<TeamNumber | undefined>();
	const [primaryColor, setPrimaryColor] = useState<HexColorCode | undefined>();
	const [secondaryColor, setSecondaryColor] = useState<HexColorCode | undefined>();

	const isReady = SetColorsInput.safeParse({
		team: team,
		colors: {
			primary: primaryColor,
			secondary: secondaryColor,
		},
	} satisfies PartialDeep<SetColorsInput>).success;

	const utils = trpc.useUtils();
	const mutation = trpc.teams.colors.set.useMutation({
		onSuccess: () => {
			utils.teams.colors.get.invalidate(team);
			utils.teams.colors.getMany.invalidate([team]);
			utils.verificationRequests.getAll.invalidate();
			utils.verificationRequests.getAllForTeam.invalidate(team);

			toast.custom(() => (
				<Toast icon={<CheckIcon width='22' height='22' />} color='green'>
					Successfully set colors for team {team}
				</Toast>
			));
		},
	});

	const reset = () => {
		setRawTeam('');
		setRawPrimaryColor('');
		setRawSecondaryColor('');

		setTeam(undefined);
		setPrimaryColor(undefined);
		setSecondaryColor(undefined);
	};

	const onSubmit = () => {
		if (!(isReady && primaryColor && secondaryColor && team)) {
			return;
		}

		mutation.mutate({
			team,
			colors: {
				primary: primaryColor,
				secondary: secondaryColor,
			},
		});
	};

	return (
		<Card className='flex flex-col gap-rx-3 [view-transition-name:main-card]'>
			<Heading as='h2' size='5'>
				Set colors
			</Heading>

			<div className='flex flex-col gap-rx-2'>
				<TeamInput teamNumber={rawTeam} onChange={setRawTeam} onValidChange={setTeam} />

				<div className='flex w-full gap-rx-2'>
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

			<div className='flex gap-rx-4 justify-between pt-rx-3'>
				<Button
					onClick={reset}
					variant='outline'
					disabled={mutation.isPending || !(rawTeam || rawPrimaryColor || rawSecondaryColor)}
					color='red'
				>
					Reset
				</Button>

				<Button
					onClick={onSubmit}
					variant='surface'
					loading={mutation.isPending}
					disabled={!isReady}
					color={isReady ? undefined : 'red'}
				>
					Set colors
				</Button>
			</div>

			{team && <TeamCard teamNumber={team} />}
		</Card>
	);
}
