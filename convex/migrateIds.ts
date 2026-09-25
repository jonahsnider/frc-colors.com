import { v } from 'convex/values';
import { internalMutation } from './_generated/server';

const args = { cursor: v.union(v.string(), v.null()) };
const returns = v.object({ cursor: v.string(), isDone: v.boolean(), removed: v.number() });

export const verificationRequests = internalMutation({
	args,
	returns,
	handler: async (ctx, { cursor }) => {
		const page = await ctx.db.query('verificationRequests').paginate({ cursor, numItems: 100 });
		let removed = 0;
		for (const row of page.page) {
			if (row.id === undefined) continue;
			await ctx.db.patch(row._id, { id: undefined });
			removed++;
		}
		return { cursor: page.continueCursor, isDone: page.isDone, removed };
	},
});

export const colorSubmissions = internalMutation({
	args,
	returns,
	handler: async (ctx, { cursor }) => {
		const page = await ctx.db.query('colorSubmissions').paginate({ cursor, numItems: 100 });
		let removed = 0;
		for (const row of page.page) {
			if (row.id === undefined) continue;
			await ctx.db.patch(row._id, { id: undefined });
			removed++;
		}
		return { cursor: page.continueCursor, isDone: page.isDone, removed };
	},
});
