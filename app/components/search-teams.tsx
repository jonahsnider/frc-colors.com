import { InternalTeamSchema } from '../api/_lib/internal/team/dtos/internal-team.dto';
import TeamCard from './team-card/team-card';

export default function SearchTeams({ team }: { team: InternalTeamSchema }) {
	return (
		<div className='flex flex-col space-y-4'>
			{/* <div>
				<input
					className={clsx('transition-all h-14 rounded bg-neutral-200 p-4 outline-none', {
						'border-4 border-red-400': !valid,
					})}
					placeholder='Enter a team number'
					type='text'
					name='team'
					value={teamNumber}
					required
				/>
			</div> */}

			<TeamCard {...team} />
		</div>
	);
}
