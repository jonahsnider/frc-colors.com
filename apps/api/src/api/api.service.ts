import { serve } from '@hono/node-server';
import { getConnInfo } from '@hono/node-server/conninfo';
import { captureException } from '@sentry/node';
import type { Context } from 'hono';
import { inspectRoutes } from 'hono/dev';
import type { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto.ts';
import { configService } from '../config/config.service.ts';
import { baseLogger } from '../logger/logger.ts';
import type { TeamNumber } from '../teams/dtos/team-number.dto.ts';
import { createAppController } from './controllers/app.controller.ts';
import type { ManyTeamColorsHttp, ManyTeamColorsHttpEntry, TeamColorsHttp } from './interfaces/http.interface.ts';

export class ApiService {
	private static readonly RAILWAY_REAL_IP_HEADER = 'X-Real-IP';

	static getIp(context: Context): string | undefined {
		const proxyIp = context.req.header(ApiService.RAILWAY_REAL_IP_HEADER);

		if (proxyIp) {
			return proxyIp;
		}

		try {
			return getConnInfo(context).remote.address;
		} catch (error) {
			captureException(error);

			return undefined;
		}
	}

	static teamColorsToDto(colors: TeamColors): TeamColorsHttp {
		return {
			primaryHex: colors.primary,
			secondaryHex: colors.secondary,
			verified: colors.verified,
		};
	}

	static manyTeamColorsToDto(colors: ManyTeamColors): ManyTeamColorsHttp {
		const mapped: Record<TeamNumber, ManyTeamColorsHttpEntry> = {};

		for (const [team, teamColors] of colors) {
			const colors = teamColors ? ApiService.teamColorsToDto(teamColors) : null;
			mapped[team] = {
				colors,
				teamNumber: team,
			};
		}

		return {
			teams: mapped,
		};
	}

	private readonly logger = baseLogger.child({ module: 'server' });

	private initialized = false;

	initServer(): void {
		if (this.initialized) {
			throw new Error('Server already initialized');
		}

		this.initialized = true;

		const appController = createAppController();

		serve(
			{
				fetch: appController.fetch,
				port: configService.port,
			},
			(info) => {
				this.logger.info(`Listening at http://localhost:${info.port}`);
			},
		);

		if (configService.nodeEnv === 'development') {
			this.logger.debug('Routes:');
			for (const route of inspectRoutes(appController)) {
				if (!route.isMiddleware) {
					this.logger.debug(`${route.method} ${route.path}`);
				}
			}
		}
	}
}

export const apiService = new ApiService();
