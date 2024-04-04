import { TeamNumber } from '@frc-colors/api/src/teams/dtos/team-number.dto';
import { parseAsInteger, useQueryState } from 'nuqs';
import { type PropsWithChildren, createContext, useEffect, useMemo, useState } from 'react';

type ContextValue = {
	teamNumberRaw: string;
	teamNumber?: TeamNumber;
	setTeamNumber: (teamNumberRaw: string) => void;
};

export const TeamNumberContext = createContext<ContextValue>({
	teamNumberRaw: '',
	// biome-ignore lint/suspicious/noEmptyBlockStatements: This is intentionally empty
	setTeamNumber: () => {},
});

export function TeamNumberProvider({ children }: PropsWithChildren) {
	const [teamNumberRaw, setTeamNumberRaw] = useQueryState('team', parseAsInteger);
	const [teamNumber, setTeamNumberValid] = useState<TeamNumber>();

	const setTeamNumber = useMemo(
		() => (newValue: string) => {
			setTeamNumberRaw(newValue === '' ? null : Number(newValue));

			if (newValue === '') {
				setTeamNumberValid(undefined);
			} else {
				const parsed = TeamNumber.safeParse(newValue);

				if (parsed.success) {
					setTeamNumberValid(parsed.data);
				}
			}
		},
		[setTeamNumberRaw],
	);

	// biome-ignore lint/correctness/useExhaustiveDependencies: This should only run once on mount, to read the team number from query params
	useEffect(() => {
		setTeamNumber(teamNumberRaw?.toString() ?? '');
	}, []);

	const contextValue: ContextValue = useMemo(
		() => ({
			teamNumberRaw: teamNumberRaw?.toString() ?? '',
			teamNumber,
			setTeamNumber,
		}),
		[teamNumberRaw, setTeamNumber, teamNumber],
	);

	return <TeamNumberContext.Provider value={contextValue}>{children}</TeamNumberContext.Provider>;
}
