'use node';

import { v } from 'convex/values';
import { GeneratedColors } from '../src/colors/generated/generated-colors.service';
import { internal } from './_generated/api';
import { internalAction } from './_generated/server';

const generatedColors = new GeneratedColors();

export const process = internalAction({
	args: { team: v.number() },
	returns: v.null(),
	handler: async (ctx, { team }) => {
		const unverified = await ctx.runQuery(internal.colors.getUnverifiedTeams, { teams: [team] });
		if (unverified.length === 0) return null;
		const colors = (await generatedColors.getTeamColors(team)) ?? null;
		await ctx.runMutation(internal.colors.updateGeneratedBatch, {
			entries: [{ team, colors }],
		});
		return null;
	},
});
