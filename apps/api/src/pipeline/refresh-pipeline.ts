import { captureException } from '@sentry/node';
import pLimit from 'p-limit';
import { colorsService } from '../colors/colors.service.ts';
import { firstService } from '../first/first.service.ts';
import { baseLogger } from '../logger/logger.ts';
import type { TeamNumber } from '../teams/dtos/team-number.dto.ts';

const logger = baseLogger.child({ module: 'refresh-pipeline' });

const colorLimit = pLimit(50);

export async function refreshAllTeamColors(): Promise<void> {
	try {
		logger.info('Starting refresh pipeline');

		logger.info('Fetching team numbers from FRC Events API');
		const allTeams: TeamNumber[] = await Array.fromAsync(firstService.getTeamNumbers());
		logger.info({ teamCount: allTeams.length }, 'Fetched all team numbers');

		logger.debug({ concurrency: colorLimit.concurrency }, 'Generating and updating team colors from avatars.frc.sh');
		const colorResults = await Promise.allSettled(
			allTeams.map(async (team) => {
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
		logger.info({ processed: allTeams.length, failures: colorFailures }, 'Extracted colors');

		logger.info('Pipeline complete');
	} catch (error) {
		captureException(error);
		logger.error(error, 'Pipeline failed');
	}
}
