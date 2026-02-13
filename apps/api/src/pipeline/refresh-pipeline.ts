import { captureException } from '@sentry/bun';
import pLimit from 'p-limit';
import { colorsService } from '../colors/colors.service';
import { firstService } from '../first/first.service';
import { baseLogger } from '../logger/logger';
import { avatarService } from '../teams/avatar/avatar.service';
import type { TeamNumber } from '../teams/dtos/team-number.dto';

const logger = baseLogger.child({ module: 'refresh-pipeline' });

const avatarLimit = pLimit(10);
const colorLimit = pLimit(50);

export async function refreshAllTeamColors(): Promise<void> {
	try {
		logger.info('Starting refresh pipeline');

		logger.info('Fetching team numbers from FRC Events API');
		const allTeams: TeamNumber[] = await Array.fromAsync(firstService.getTeamNumbers());
		logger.info({ teamCount: allTeams.length }, 'Fetched all team numbers');

		logger.debug('Checking what teams need to have avatars refreshed');
		const staleTeams = await avatarService.shouldRefresh(allTeams);
		logger.info({ staleCount: staleTeams.length }, 'Checked what teams have stale avatars');

		logger.debug({ concurrency: avatarLimit.concurrency }, 'Refreshing team avatars from TBA');
		const avatarResults = await Promise.allSettled(
			staleTeams.map((team) =>
				avatarLimit(async () => {
					await avatarService.refreshAvatar(team);
					return team;
				}),
			),
		);

		const refreshedTeams: TeamNumber[] = [];
		for (const result of avatarResults) {
			if (result.status === 'fulfilled') {
				refreshedTeams.push(result.value);
			} else {
				captureException(result.reason);
				logger.error(result.reason, 'Failed to refresh avatar');
			}
		}
		logger.info({ refreshedCount: refreshedTeams.length }, 'Refreshed avatars');

		logger.debug({ concurrency: colorLimit.concurrency }, 'Generating and updating team colors from avatars');
		const colorResults = await Promise.allSettled(
			refreshedTeams.map(async (team) => {
				const isVerified = await colorsService.stored.isVerified(team);

				if (isVerified) {
					return;
				}

				const colors = await colorLimit(() => colorsService.generated.getTeamColors(team));

				if (colors) {
					await colorsService.stored.setTeamColors(team, colors);
				} else {
					await colorsService.stored.deleteTeamColors(team);
				}
			}),
		);
		let colorFailures = 0;
		for (const result of colorResults) {
			if (result.status === 'rejected') {
				colorFailures++;
				captureException(result.reason);
				logger.error(result.reason, 'Failed to extract colors');
			}
		}
		logger.info({ processed: refreshedTeams.length, failures: colorFailures }, 'Extracted colors');

		logger.info('Pipeline complete');
	} catch (error) {
		captureException(error);
		logger.error(error, 'Pipeline failed');
	}
}
