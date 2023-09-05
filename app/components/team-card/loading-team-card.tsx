import { CheckBadgeIcon } from '@heroicons/react/24/solid';
import LoadingSkeleton from '../loading-skeleton';
import BaseTeamCard from './base-team-card';

export default function LoadingTeamCard() {
	return (
		<BaseTeamCard
			title={<LoadingSkeleton className='w-72 h-6 bg-gray-400 mt-2' />}
			avatar={<LoadingSkeleton className='w-48 h-48 rounded bg-gradient-to-br from-gray-300 to-gray-400' bar={false} />}
			// To avoid layout shift after load
			verifiedBadge={<CheckBadgeIcon className='max-md:h-0 md:h-6 invisible' />}
		/>
	);
}
