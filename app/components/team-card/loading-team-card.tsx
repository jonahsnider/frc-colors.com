import LoadingSkeleton from '../loading-skeleton';
import BaseTeamCard from './base-team-card';

import { CheckBadgeIcon } from '@heroicons/react/24/solid';

export default function LoadingTeamCard() {
	return (
		<BaseTeamCard
			title={<LoadingSkeleton className='w-72 h-6 bg-gray-400' />}
			avatar={<LoadingSkeleton className='w-48 h-48 rounded bg-gradient-to-br from-gray-300 to-gray-400' bar={false} />}
			// To avoid layout shift after load
			verifiedBadge={<CheckBadgeIcon className='h-6 invisible' />}
		/>
	);
}
