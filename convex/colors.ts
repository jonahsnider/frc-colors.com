import { v } from 'convex/values';
import { SetColorsInput } from '../src/teams/dtos/set-colors-input.dto';
import { TeamNumber } from '../src/teams/dtos/team-number.dto';
import { internalMutation, internalQuery, mutation, query } from './_generated/server';
import { requireAdmin } from './lib/admin';
import { finishPendingVerificationRequests, upsertTeamColors } from './lib/colors';

export const TeamColors = v.object({ primary: v.string(), secondary: v.string(), verified: v.boolean() });
export const TeamColorsEntry = v.object({ teamNumber: v.number(), colors: v.union(TeamColors, v.null()) });

export const getOne = query({
	args: { team: v.number() },
	returns: v.union(TeamColors, v.null()),
	handler: async (ctx, { team }) => {
		TeamNumber.parse(team);
		const row = await ctx.db
			.query('teamColors')
			.withIndex('by_team', (q) => q.eq('team', team))
			.unique();
		return row ? { primary: row.primaryHex, secondary: row.secondaryHex, verified: row.verified } : null;
	},
});

export const getMany = query({
	args: { teams: v.array(v.number()) },
	returns: v.array(TeamColorsEntry),
	handler: async (ctx, { teams }) => {
		if (teams.length > 2000) throw new Error('At most 2000 teams can be requested');
		for (const team of teams) TeamNumber.parse(team);
		return Promise.all(
			teams.map(async (teamNumber) => {
				const row = await ctx.db
					.query('teamColors')
					.withIndex('by_team', (q) => q.eq('team', teamNumber))
					.unique();
				return {
					teamNumber,
					colors: row ? { primary: row.primaryHex, secondary: row.secondaryHex, verified: row.verified } : null,
				};
			}),
		);
	},
});

export const getPage = internalQuery({
	args: { cursor: v.union(v.string(), v.null()) },
	returns: v.object({ items: v.array(TeamColorsEntry), cursor: v.string(), done: v.boolean() }),
	handler: async (ctx, { cursor }) => {
		const page = await ctx.db.query('teamColors').paginate({ numItems: 500, cursor });
		return {
			items: page.page.map((row) => ({
				teamNumber: row.team,
				colors: { primary: row.primaryHex, secondary: row.secondaryHex, verified: row.verified },
			})),
			cursor: page.continueCursor,
			done: page.isDone,
		};
	},
});

export const setVerified = mutation({
	args: { password: v.string(), team: v.number(), primaryHex: v.string(), secondaryHex: v.string() },
	returns: v.null(),
	handler: async (ctx, { password, team, primaryHex, secondaryHex }) => {
		requireAdmin(password);
		SetColorsInput.parse({ team, colors: { primary: primaryHex, secondary: secondaryHex } });
		await upsertTeamColors(ctx, team, { primaryHex, secondaryHex, verified: true });
		await finishPendingVerificationRequests(ctx, team);
		return null;
	},
});

export const getUnverifiedTeams = internalQuery({
	args: { teams: v.array(v.number()) },
	returns: v.array(v.number()),
	handler: async (ctx, { teams }) => {
		const entries = await Promise.all(
			teams.map(async (team) => ({
				team,
				row: await ctx.db
					.query('teamColors')
					.withIndex('by_team', (q) => q.eq('team', team))
					.unique(),
			})),
		);
		return entries.filter(({ row }) => !row?.verified).map(({ team }) => team);
	},
});

export const updateGeneratedBatch = internalMutation({
	args: {
		entries: v.array(v.object({ team: v.number(), colors: v.union(TeamColors, v.null()) })),
	},
	returns: v.null(),
	handler: async (ctx, { entries }) => {
		for (const { team, colors } of entries) {
			const current = await ctx.db
				.query('teamColors')
				.withIndex('by_team', (q) => q.eq('team', team))
				.unique();
			if (current?.verified) continue;
			if (!colors) {
				if (current) await ctx.db.delete(current._id);
				continue;
			}
			await upsertTeamColors(ctx, team, {
				primaryHex: colors.primary,
				secondaryHex: colors.secondary,
				verified: false,
			});
		}
		return null;
	},
});
