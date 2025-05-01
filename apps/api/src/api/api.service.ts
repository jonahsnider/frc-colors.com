import assert from 'node:assert/strict';
import { captureException } from '@sentry/bun';
import type { Server } from 'bun';
import type { Context } from 'hono';
import { inspectRoutes } from 'hono/dev';
import type { ManyTeamColors, TeamColors } from '../colors/dtos/colors.dto';
import { configService } from '../config/config.service';
import { baseLogger } from '../logger/logger';
import type { TeamNumber } from '../teams/dtos/team-number.dto';
import { createAppController } from './controllers/app.controller';
import type { Env } from './interfaces/env.interface';
import type { ManyTeamColorsHttp, ManyTeamColorsHttpEntry, TeamColorsHttp } from './interfaces/http.interface';

export class ApiService {
	private static readonly RAILWAY_REAL_IP_HEADER = 'X-Real-IP';

	static getIp(context: Context<Env>): string | undefined;
	static getIp(server: Server, request: Request): string | undefined;
	static getIp(serverOrContext: Server | Context<Env>, request?: Request): string | undefined {
		if ('env' in serverOrContext) {
			const context = serverOrContext;

			const proxyIp = serverOrContext.req.header(ApiService.RAILWAY_REAL_IP_HEADER);

			if (proxyIp) {
				return proxyIp;
			}

			try {
				const socketAddress = context.env.server.requestIP(context.req.raw);

				return socketAddress?.address;
			} catch (error) {
				captureException(error);

				return undefined;
			}
		}

		const server = serverOrContext;
		assert(request, new TypeError('Request was not available'));
		const proxyIp = request.headers.get(ApiService.RAILWAY_REAL_IP_HEADER);

		if (proxyIp) {
			return proxyIp;
		}

		try {
			const socketAddress = server.requestIP(request);

			return socketAddress?.address;
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

		let server: Server | undefined = undefined;

		// This is like, super unsafe, but also should never cause an issue
		// The reason for this silliness is that there is a circular dependency between Bun.serve requiring us to set a fetch function, and the fetch function requiring the server to be created
		const getServer = (): Server => server as Server;

		const appController = createAppController(getServer);

		server = Bun.serve({
			fetch: appController.fetch,
			port: configService.port,
			development: configService.nodeEnv === 'development',
		});

		this.logger.info(`Listening at ${server.url.toString()}`);

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
