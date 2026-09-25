import { v } from 'convex/values';
import type { Id } from './_generated/dataModel';
import { TeamNumber } from '../src/teams/dtos/team-number.dto';
import { mutation, query } from './_generated/server';
import { isAdmin, requireAdmin } from './lib/admin';
import { ReviewStatus } from './schema';

export const VerificationRequest = v.object({
	_id: v.id('verificationRequests'),
	team: v.number(),
	status: ReviewStatus,
	createdAt: v.number(),
	updatedAt: v.optional(v.number()),
});

export const list = query({
	args: { password: v.string(), team: v.optional(v.number()), cutoff: v.number() },
	returns: v.union(v.array(VerificationRequest), v.null()),
	handler: async (ctx, { password, team, cutoff }) => {
		if (!isAdmin(password)) return null;
		if (team !== undefined) {
			const rows = await ctx.db
				.query('verificationRequests')
				.withIndex('by_team', (q) => q.eq('team', team))
				.take(2000);
			return rows.sort((a, b) => b.createdAt - a.createdAt).map(toValue);
		}
		const [pending, finished, rejected] = await Promise.all([
			ctx.db
				.query('verificationRequests')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'PENDING'))
				.take(2000),
			ctx.db
				.query('verificationRequests')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'FINISHED').gte('updatedAt', cutoff))
				.take(2000),
			ctx.db
				.query('verificationRequests')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'REJECTED').gte('updatedAt', cutoff))
				.take(2000),
		]);
		return [...pending, ...finished, ...rejected]
			.sort((a, b) => Number(a.status !== 'PENDING') - Number(b.status !== 'PENDING') || b.createdAt - a.createdAt)
			.map(toValue);
	},
});

export const create = mutation({
	args: { team: v.number() },
	returns: VerificationRequest,
	handler: async (ctx, { team }) => {
		TeamNumber.parse(team);
		const value = { team, status: 'PENDING' as const, createdAt: Date.now() };
		const _id = await ctx.db.insert('verificationRequests', value);
		return { _id, ...value };
	},
});

export const updateStatus = mutation({
	args: { password: v.string(), _id: v.id('verificationRequests'), status: ReviewStatus },
	returns: v.union(VerificationRequest, v.null()),
	handler: async (ctx, { password, _id, status }) => {
		requireAdmin(password);
		const row = await ctx.db.get(_id);
		if (!row) return null;
		const updatedAt = Date.now();
		await ctx.db.patch(row._id, { status, updatedAt });
		return toValue({ ...row, status, updatedAt });
	},
});

function toValue(row: {
	_id: Id<'verificationRequests'>;
	team: number;
	status: 'PENDING' | 'FINISHED' | 'REJECTED';
	createdAt: number;
	updatedAt?: number;
}) {
	return {
		_id: row._id,
		team: row.team,
		status: row.status,
		createdAt: row.createdAt,
		...(row.updatedAt === undefined ? {} : { updatedAt: row.updatedAt }),
	};
}
