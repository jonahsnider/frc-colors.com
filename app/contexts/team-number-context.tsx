import { PropsWithChildren, createContext, useMemo, useState } from 'react';
import { TeamNumberSchema } from '../api/_lib/teams/dtos/team-number.dto';

type ContextValue = {
	teamNumberRaw: string;
	teamNumber?: TeamNumberSchema;
	setTeamNumber: (teamNumberRaw: string) => void;
};

export const TeamNumberContext = createContext<ContextValue>({
	teamNumberRaw: '',
	// biome-ignore lint/nursery/noEmptyBlockStatements: This is a no-op function
	setTeamNumber: () => {},
});

export function TeamNumberProvider({ children }: PropsWithChildren) {
	const [teamNumberRaw, setTeamNumberRaw] = useState('');
	const [teamNumber, setTeamNumberValid] = useState<TeamNumberSchema>();

	const setTeamNumber = useMemo(
		() => (teamNumberRaw: string) => {
			setTeamNumberRaw(teamNumberRaw);

			if (teamNumberRaw === '') {
				setTeamNumberValid(undefined);
			} else {
				const parsed = TeamNumberSchema.safeParse(teamNumberRaw);

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
