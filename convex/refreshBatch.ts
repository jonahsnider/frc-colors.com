'use node';

import { v } from 'convex/values';
import { GeneratedColors } from '../src/colors/generated/generated-colors.service';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';

const generatedColors = new GeneratedColors();

export const process = internalAction({
	args: { teams: v.array(v.number()) },
	returns: v.null(),
	handler: async (ctx, { teams }) => {
		const unverified = await ctx.runQuery(internal.colors.getUnverifiedTeams, { teams });
		const results = await Promise.allSettled(
			unverified.map(async (team) => ({ team, colors: (await generatedColors.getTeamColors(team)) ?? null })),
		);
		const entries = results.flatMap((result) => {
			if (result.status === 'fulfilled') return [result.value];
			console.error('Failed to generate team colors', result.reason);
			return [];
		});
		await ctx.runMutation(internal.colors.updateGeneratedBatch, { entries });
		return null;
	},
});
