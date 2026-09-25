import { v } from 'convex/values';
import { TeamNumber } from '../src/teams/dtos/team-number.dto';
import { internalMutation, query } from './_generated/server';

export const get = query({
	args: { team: v.number() },
	returns: v.object({ name: v.optional(v.string()) }),
	handler: async (ctx, { team }) => {
		TeamNumber.parse(team);
		const row = await ctx.db
			.query('teamNames')
			.withIndex('by_team', (q) => q.eq('team', team))
			.unique();
		return row ? { name: row.name } : {};
	},
});

export const upsertBatch = internalMutation({
	args: { teams: v.array(v.object({ team: v.number(), name: v.string() })) },
	returns: v.null(),
	handler: async (ctx, { teams }) => {
		for (const { team, name } of teams) {
			TeamNumber.parse(team);
			const current = await ctx.db
				.query('teamNames')
				.withIndex('by_team', (q) => q.eq('team', team))
				.unique();
			if (current?.name === name) continue;
			if (current) await ctx.db.patch(current._id, { name });
			else await ctx.db.insert('teamNames', { team, name });
		}
		return null;
	},
});
