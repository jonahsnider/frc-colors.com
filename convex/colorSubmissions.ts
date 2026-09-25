import { v } from 'convex/values';
import { CreateColorSubmission } from '../src/color-submissions/dtos/color-submission.dto';
import { mutation, query } from './_generated/server';
import { isAdmin, requireAdmin } from './lib/admin';
import { finishPendingVerificationRequests, upsertTeamColors } from './lib/colors';
import { ReviewStatus } from './schema';

export const ColorSubmission = v.object({
	id: v.string(),
	teamNumber: v.number(),
	primaryHex: v.string(),
	secondaryHex: v.string(),
	status: ReviewStatus,
	createdAt: v.number(),
	updatedAt: v.optional(v.number()),
});

export const list = query({
	args: { password: v.string(), team: v.optional(v.number()), cutoff: v.number() },
	returns: v.union(v.array(ColorSubmission), v.null()),
	handler: async (ctx, { password, team, cutoff }) => {
		if (!isAdmin(password)) return null;
		if (team !== undefined) {
			const rows = await ctx.db
				.query('colorSubmissions')
				.withIndex('by_team', (q) => q.eq('team', team))
				.take(2000);
			return rows.sort((a, b) => b.createdAt - a.createdAt).map(toValue);
		}
		const [pending, finished, rejected] = await Promise.all([
			ctx.db
				.query('colorSubmissions')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'PENDING'))
				.take(2000),
			ctx.db
				.query('colorSubmissions')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'FINISHED').gte('updatedAt', cutoff))
				.take(2000),
			ctx.db
				.query('colorSubmissions')
				.withIndex('by_status_and_updatedAt', (q) => q.eq('status', 'REJECTED').gte('updatedAt', cutoff))
				.take(2000),
		]);
		return [...pending, ...finished, ...rejected]
			.sort(
				(a, b) =>
					Number(a.status !== 'PENDING') - Number(b.status !== 'PENDING') ||
					(b.updatedAt ?? 0) - (a.updatedAt ?? 0) ||
					b.createdAt - a.createdAt,
			)
			.map(toValue);
	},
});

export const create = mutation({
	args: { teamNumber: v.number(), primaryHex: v.string(), secondaryHex: v.string() },
	returns: ColorSubmission,
	handler: async (ctx, { teamNumber, primaryHex, secondaryHex }) => {
		CreateColorSubmission.parse({ teamNumber, primaryHex, secondaryHex });
		const value = {
			id: crypto.randomUUID(),
			team: teamNumber,
			primaryHex,
			secondaryHex,
			status: 'PENDING' as const,
			createdAt: Date.now(),
		};
		await ctx.db.insert('colorSubmissions', value);
		return toValue(value);
	},
});

export const updateStatus = mutation({
	args: { password: v.string(), id: v.string(), status: ReviewStatus },
	returns: ColorSubmission,
	handler: async (ctx, { password, id, status }) => {
		requireAdmin(password);
		const row = await ctx.db
			.query('colorSubmissions')
			.withIndex('by_submission_id', (q) => q.eq('id', id))
			.unique();
		if (!row) throw new Error('Color submission not found');
		const updatedAt = Date.now();
		await ctx.db.patch(row._id, { status, updatedAt });
		if (status === 'FINISHED') {
			await upsertTeamColors(ctx, row.team, {
				primaryHex: row.primaryHex,
				secondaryHex: row.secondaryHex,
				verified: true,
			});
			await finishPendingVerificationRequests(ctx, row.team);
		}
		return toValue({ ...row, status, updatedAt });
	},
});

function toValue(row: {
	id: string;
	team: number;
	primaryHex: string;
	secondaryHex: string;
	status: 'PENDING' | 'FINISHED' | 'REJECTED';
	createdAt: number;
	updatedAt?: number;
}) {
	return {
		id: row.id,
		teamNumber: row.team,
		primaryHex: row.primaryHex,
		secondaryHex: row.secondaryHex,
		status: row.status,
		createdAt: row.createdAt,
		...(row.updatedAt === undefined ? {} : { updatedAt: row.updatedAt }),
	};
}
