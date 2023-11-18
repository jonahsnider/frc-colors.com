import { HttpError } from '@/app/swr';
import { NextResponse } from 'next/server';
import { configService } from '../../_lib/config/config.service';
import { exceptionRouteWrapper } from '../../_lib/exception-route-wrapper';
import { TeamNumberSchema } from '../../_lib/teams/dtos/team-number.dto';
import { db } from '../../_lib/db/db';
import { Schema } from '../../_lib/db/index';

const url = 'https://www.thebluealliance.com/avatars';
const IMAGE_REG_EXP =
	/<img class="team-avatar.+?".+? src="data:image\/png;base64, (?<png>.+?)".+?title="Team (?<team>\d+)"\/>/gims;

export const GET = exceptionRouteWrapper.wrapRoute<never>(async () => {
	const response = await fetch(url, {
		headers: {
			authorization: `Bearer ${configService.tbaApiKey}`,
		},
		next: {
			revalidate: false,
		},
	});

	if (!response.ok) {
		throw await HttpError.create(response);
	}

	const html = await response.text();

	const matches = [...html.matchAll(IMAGE_REG_EXP)];

	const avatars = matches.map((match) => ({
		team: match.groups?.team,
		png: match.groups?.png,
	}));

	const processedAvatars = avatars
		.filter((avatar): avatar is Record<'team' | 'png', string> => Boolean(avatar.team && avatar.png))
		.map((avatar) => ({
			team: TeamNumberSchema.parse(avatar.team),
			png: Buffer.from(avatar.png, 'base64'),
		}));

	await db.transaction(async (tx) => {
		await tx
			.insert(Schema.teams)
			.values(processedAvatars.map((entry) => ({ id: entry.team })))
			.onConflictDoNothing();

		for (const entry of processedAvatars) {
			await tx
				.insert(Schema.avatars)
				.values({ teamId: entry.team, png: entry.png })
				.onConflictDoUpdate({
					target: Schema.avatars.teamId,
					set: { png: entry.png, createdAt: new Date() },
				});
		}
	});

	return new NextResponse();
});
