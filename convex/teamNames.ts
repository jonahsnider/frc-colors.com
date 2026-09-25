import { v } from 'convex/values';
import { TeamNumber } from '../src/teams/dtos/team-number.dto';
import { internal } from './_generated/api';
import { internalAction, internalMutation, query } from './_generated/server';
import { getTeamsPage } from './lib/tba';

const batchSize = 100;

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

export const backfill = internalAction({
	args: {},
	returns: v.object({ teams: v.number(), pages: v.number() }),
	handler: async (ctx) => {
		let teams = 0;
		let pages = 0;
		for (let page = 0; ; page++) {
			const { names, done } = await getTeamsPage(page);
			if (done) break;
			for (let offset = 0; offset < names.length; offset += batchSize) {
				await ctx.runMutation(internal.teamNames.upsertBatch, {
					teams: names.slice(offset, offset + batchSize),
				});
			}
			teams += names.length;
			pages++;
		}
		return { teams, pages };
	},
});
