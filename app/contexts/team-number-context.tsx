import { useNavigate, useSearch } from '@tanstack/react-router';
import { createContext, type PropsWithChildren, useCallback, useMemo } from 'react';
import { TeamNumber } from '@/src/teams/dtos/team-number.dto';

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
	const { team: teamNumber } = useSearch({ from: '/' });
	const teamNumberRaw = teamNumber?.toString() ?? '';
	const navigate = useNavigate({ from: '/' });
	const setTeamNumber = useCallback(
		(newValue: string) => {
			const parsed = TeamNumber.safeParse(newValue);
			void navigate({
				to: '/',
				search: (previous) => ({ ...previous, team: parsed.success ? parsed.data : undefined }),
				replace: true,
			});
		},
		[navigate],
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
