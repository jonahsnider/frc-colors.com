import { difference } from '@jonahsnider/util';
import { Prisma, PrismaClient } from '@prisma/client';
import * as Sentry from '@sentry/nextjs';
import convert from 'convert';
import { prisma } from '../../prisma';
import { TbaService, tbaService } from '../../tba/tba.service';
import { TeamNumberSchema } from '../dtos/team-number.dto';

export class AvatarsService {
	private static readonly AVATAR_CACHE_TTL = convert(14, 'days');

	constructor(private readonly tba: TbaService, private readonly prisma: PrismaClient) {}

	async purgeExpiredAvatars(): Promise<void> {
		const expired = new Date(Date.now() - AvatarsService.AVATAR_CACHE_TTL.to('ms'));

		await this.prisma.avatar.deleteMany({
			where: {
				createdAt: { lt: expired },
			},
		});
	}

	async getAvatar(teamNumber: TeamNumberSchema): Promise<Buffer | undefined> {
		return Sentry.startSpan({ name: 'Get avatar for team' }, async () => {
			const cached = await this.prisma.avatar.findUnique({
				where: {
					teamId: teamNumber,
				},
			});

			if (cached) {
				return cached.png ?? undefined;
			}

			return Sentry.startSpan({ name: 'Get avatar from TBA and cache in DB' }, async () => {
				// Cache is missing, we should populate it
				const avatar = await this.tba.getTeamAvatarForThisYear(teamNumber);

				try {
					// Even if the avatar is missing from TBA, we store in the DB
					// Anything we can do to avoid hitting TBA
					await this.prisma.team.upsert({
						where: { id: teamNumber },
						create: { id: teamNumber, avatar: { create: { png: avatar } } },
						update: { avatar: { create: { png: avatar } } },
					});
				} catch (error) {
					if (
						error instanceof Prisma.PrismaClientKnownRequestError &&
						(error.code === 'P2002' || error.code === 'P2014')
					) {
						// P2002: The team was already created by another request which came in at the same time as this one, usually from the web app
						// P2014: Not sure what causes this, I assume some kind of race condition with conflicting parallel writes
						// We can safely ignore these errors, since it's not a problem if we just don't update the avatar cache
					} else {
						throw error;
					}
				}

				return avatar;
			});
		});
	}

	async getAvatars(teamNumbers: TeamNumberSchema[]): Promise<Map<TeamNumberSchema, Buffer | undefined>> {
		return Sentry.startSpan({ name: 'Get many avatars for teams' }, async () => {
			const cached = await this.prisma.avatar.findMany({
				where: {
					teamId: { in: teamNumbers },
				},
				select: {
					png: true,
					teamId: true,
				},
			});
			const avatars = new Map<TeamNumberSchema, Buffer | undefined>(
				cached.map((avatar) => [avatar.teamId, avatar.png ?? undefined]),
			);

			const missingFromCache = difference<TeamNumberSchema>(teamNumbers, avatars.keys());

			if (missingFromCache.size > 0) {
				await Sentry.startSpan({ name: 'Get many avatars from TBA and cache in DB' }, async () => {
					const tbaAvatars = await Promise.all(
						Array.from(missingFromCache).map(async (teamNumber) => ({
							teamNumber: teamNumber,
							png: await this.tba.getTeamAvatarForThisYear(teamNumber),
						})),
					);

					// There is no upsert many Prisma operation, so we use a transaction to wrap many individual upserts
					await this.prisma.$transaction(
						tbaAvatars.map(({ teamNumber, png }) =>
							this.prisma.team.upsert({
								where: { id: teamNumber },
								create: { id: teamNumber, avatar: { create: { png } } },
								update: { avatar: { create: { png } } },
							}),
						),
					);

					for (const { teamNumber, png } of tbaAvatars) {
						avatars.set(teamNumber, png);
					}
				});
			}

			return avatars;
		});
	}
}

export const avatarsService = new AvatarsService(tbaService, prisma);
