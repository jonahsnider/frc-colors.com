import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { PropsWithChildren, createContext, useMemo, useState } from 'react';

type ContextValue = {
	teamNumberRaw: string;
	teamNumber?: TeamNumber;
	setTeamNumber: (teamNumberRaw: string) => void;
};

export const TeamNumberContext = createContext<ContextValue>({
	teamNumberRaw: '',
	setTeamNumber: () => {},
});

export function TeamNumberProvider({ children }: PropsWithChildren) {
	const [teamNumberRaw, setTeamNumberRaw] = useState('');
	const [teamNumber, setTeamNumberValid] = useState<TeamNumber>();

	const setTeamNumber = useMemo(
		() => (teamNumberRaw: string) => {
			setTeamNumberRaw(teamNumberRaw);

			if (teamNumberRaw === '') {
				setTeamNumberValid(undefined);
			} else {
				const parsed = TeamNumber.safeParse(teamNumberRaw);

				if (parsed.success) {
					setTeamNumberValid(parsed.data);
				}
			}
		},
		[],
	);

	const contextValue: ContextValue = useMemo(
		() => ({
			teamNumberRaw,
			teamNumber,
			setTeamNumber,
		}),
		[teamNumberRaw, setTeamNumber, teamNumber],
	);

	return <TeamNumberContext.Provider value={contextValue}>{children}</TeamNumberContext.Provider>;
}
