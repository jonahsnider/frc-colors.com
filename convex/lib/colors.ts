import type { MutationCtx } from '../_generated/server';

export async function upsertTeamColors(
	ctx: MutationCtx,
	team: number,
	colors: { primaryHex: string; secondaryHex: string; verified: boolean },
) {
	const current = await ctx.db
		.query('teamColors')
		.withIndex('by_team', (q) => q.eq('team', team))
		.unique();
	const now = Date.now();
	if (current) {
		await ctx.db.patch(current._id, { ...colors, updatedAt: now });
	} else {
		await ctx.db.insert('teamColors', { team, ...colors, createdAt: now });
	}
}

export async function finishPendingVerificationRequests(ctx: MutationCtx, team: number) {
	const requests = await ctx.db
		.query('verificationRequests')
		.withIndex('by_team', (q) => q.eq('team', team))
		.take(2000);
	for (const request of requests) {
		if (request.status === 'PENDING') {
			await ctx.db.patch(request._id, { status: 'FINISHED', updatedAt: Date.now() });
		}
	}
}
