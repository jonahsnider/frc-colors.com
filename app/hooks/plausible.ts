import { useCallback } from 'react';
import type { TeamNumber } from '@/src/teams/dtos/team-number.dto';

declare global {
	interface Window {
		plausible?: (event: string, options?: { props: { team: TeamNumber } }) => void;
	}
}

export function usePlausible() {
	return useCallback((event: 'View team', options: { props: { team: TeamNumber } }) => {
		window.plausible?.(event, options);
	}, []);
}
